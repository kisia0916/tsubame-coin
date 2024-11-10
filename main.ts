import { createHash } from "crypto";
import { block_data_interface } from "./interfaces/block_data_interface";
import { transactions_data_interface } from "./interfaces/transaction_data_interface";
import {Server,Socket} from "socket.io"
import { io, NodeWebSocket } from "socket.io-client"
import { v4 as uuidv4 } from 'uuid';
import http from "http"
import { socket_server } from "./socket_sys/socket_server";
import { search_connection_nodes } from "./socket_sys/socket_client";
import { chain_data_interface } from "./interfaces/chain_data_interface";
import { add_new_block } from "./functions/logic/add_new_block";
import { count_all_diff } from "./functions/logic/count_all_diff";
import { check_block_chain_proof } from "./functions/logic/check_block_proof";
import { sync_blocks } from "./functions/logic/sync_blocks";

//fake_data
const other_nodes:string[] = [
    // "localhost:3000",
    // "localhost:5000",
    // "localhost:6000",
    // "localhost:9000"
    // "192.168.11.1:3000",
    // "localhost:8000"
]
export const PORT = 8000
export const my_ip = `localhost:${PORT}`
export const wait_connection_time = 3000
//ネットワーク設定
const server = http.createServer()
let io_server = new Server(server)
io_server.on("connection",(socket:Socket)=>{
    socket_server(io_server,socket)
})
export let client_sockets:any = []
export const add_client_sockets = (new_socket:any)=>{
    client_sockets.push(new_socket)
}
//main
export let now_chain:chain_data_interface[] = [
    {
        chain_id:"9e7f0b28-5e1f-4f40-8f6f-c9b082886eca",
        root_block:undefined,
        data:[
            {
                block_num:0,
                nance_length:3,
                transactions:[],
                before_block_hash:"",
                nance:664,
            },
            {
                block_num:1,
                nance_length:3,
                transactions:[],
                before_block_hash:"0008f6f4f6d17012b4e6b74f0f37d2c1d587ed182be6baafd85cd2a225e33c59",
                nance:474,
            },
            {
                block_num:2,
                nance_length:3,
                transactions:[],
                before_block_hash:"0007ec78d91586008adfd8f14b761cd07106d8a870974afb025638d454f055fa",
                nance:2832,
            },
        ],
    },
    {
        chain_id:"4cd3d5cd-8d33-457b-8313-2cc853d4f8ac",
        root_block:{
            chain_id:"9e7f0b28-5e1f-4f40-8f6f-c9b082886eca",
            block_num:1
        },
        data:[
            {
                block_num:2,
                nance_length:3,
                transactions:[],
                before_block_hash:"0007ec78d91586008adfd8f14b761cd07106d8a870974afb025638d454f055fa",
                nance:2832,
            },
        ],
    },
]
const transaction_pool:transactions_data_interface[] = []
export const now_diff = 3
export const nance_char = "0"
export const max_connection_node = 2
export const delete_works_difference = (now_diff**2)*1
export let now_longest_chain:string = ""
//functions
export const get_hash = (data:string):string=>{
    const hash = createHash("sha256")
    hash.update(data)
    return hash.digest("hex")
}

export const add_block_chain = (chain_id:string,data:block_data_interface)=>{
    const target_chain_index = now_chain.findIndex((i:chain_data_interface)=>i.chain_id === chain_id)
    if (target_chain_index !== -1){
        now_chain[target_chain_index].data.push(data)
    }
    console.log(now_chain[target_chain_index])
}
export const create_new_chain = (data:chain_data_interface)=>{
    if (data.root_block === undefined && now_chain.find((i:chain_data_interface)=>i.root_block?.chain_id === data.chain_id)){
        now_chain.push(data)
    }
}

export const unit_chain = (root:chain_data_interface,branch:chain_data_interface)=>{
    const target_chain_index = now_chain.findIndex((i:chain_data_interface)=>i.chain_id === root.chain_id)
    if (target_chain_index !== -1){
        const target_chain = now_chain[target_chain_index]
        now_chain[target_chain_index].data = [...target_chain.data,...branch.data]
        now_chain[target_chain_index].chain_id = branch.chain_id
        //rootから分岐しているすべてのブランチのidを変更
        for (let i:number = 0;now_chain.length>i;i++){
            if (now_chain[i].root_block){
                const change_target_chain = now_chain[i]
                if (change_target_chain.root_block?.chain_id === target_chain.chain_id && change_target_chain.chain_id !== branch.chain_id){
                    now_chain[i].root_block = {
                        chain_id:branch.chain_id,
                        block_num:change_target_chain.root_block?.block_num
                    }
                }
            }
        }
    }
}
export const delete_blocks = (chain_id:string,start:number,count:number)=>{
    const target_chain_index = now_chain.findIndex((i:chain_data_interface)=>i.chain_id === chain_id)
    if (target_chain_index !== -1){
        now_chain[target_chain_index].data.splice(start,count)
    }
}
export const delete_chain = (chain_id:string)=>{
    const target_chain_index = now_chain.findIndex((i:chain_data_interface)=>i.chain_id === chain_id)
    if (target_chain_index !== -1){
        now_chain.splice(target_chain_index,1)
    }
}
export const add_new_chain_branch = (root_block:{chain_id:string,block_num:number},data:block_data_interface)=>{
    now_chain.push({
        chain_id:uuidv4(),
        root_block:{
            chain_id:root_block.chain_id,
            block_num:root_block.block_num
        },
        data:[data]
    })
}

//起動時にブロックチェーンの整合性確認

console.log(`chain proof:${check_block_chain_proof("4cd3d5cd-8d33-457b-8313-2cc853d4f8ac","",-1)}`)
console.log(`chain all diff:${count_all_diff("9e7f0b28-5e1f-4f40-8f6f-c9b082886eca",-1)}`)
server.listen(PORT,()=>{
    console.log(`This tsubame node is running!`)
    console.log(`Now using ip:${my_ip}`)
    if (now_chain.length > 1){
        console.log("Now chain status:\x1b[31mCompetitioning\x1b[0m")
    }else{
        console.log("Now chain status:\x1b[32mNormal\x1b[0m")
    }
    search_connection_nodes(other_nodes)
    setTimeout(()=>{
        console.log("同期を開始します")
        sync_blocks(client_sockets)
    },wait_connection_time)
    //ほかのノードとブロックを同期
    add_new_block("9e7f0b28-5e1f-4f40-8f6f-c9b082886eca",{
        block_num:3,
        nance_length:3,
        transactions:[
            {
                block_num:3,
                transaction_num:0,
                input:``,
                output:"hoge",
                amount:600,
                fee:10,
                signature:"J9jy8oQ8ulxdkPEcAsmEfuSkg81uA2zd/tKeQAnVoBMCf382aoUnoV9XHmNCl40N0fV1mEZ3Y4p0x22zv3/ep5WzLsy12cap8lDRj6amwxU7f8it33Fxde1wvGnx7eIXxUCasIqhFVq1Tj1R1f+ymKSgEXZhwOy9iDY3VubgHxxHBV8zb202kLWYoEZSMgujm1hTY/qflQlNmqRlnoxw/oc5UQWPvkd75F8e0znT5N3HA6DJg9bor7ANUsk94adPS5pwuEmU7fqg1PgI12AlQUd6q5rhPM+JyBJJ3xBWtQMUclFTWByGMwufqacyyZ1BPxJph+x9kVQwCbwOaHs9jbcuWSRmqY3e9LJzzEIni4EvNFGDgPz5bIt2hApgZ9XDwcaSMOI5pfjWYBzcqEuJxeqjM2iJ5VJzCH3MQoksSkqCItiVG3wd8uiCbyOfQC0vqBXm7XzvpHjtQ57V8A+52GmiBiehjYqlImeKnIcZjLgqP4i1XQRVU1zleust/uib"
            }
        ],
        before_block_hash:"000134dae6ce42451ac0cf2e657199857995f4e4c9f9b707691b6850f5285f83",
        nance:740
    },false)
})
