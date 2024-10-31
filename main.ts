import { createHash } from "crypto";
import { block_data_interface } from "./interfaces/block_data_interface";
import { transactions_data_interface } from "./interfaces/transaction_data_interface";
import {Server,Socket} from "socket.io"
import { io } from "socket.io-client"
import http from "http"
import { socket_server } from "./socket_sys/socket_server";
import { search_connection_nodes } from "./socket_sys/socket_client";
import { chain_data_interface } from "./interfaces/chain_data_interface";


//fake_data
const other_nodes:string[] = [
    // "localhost:3000",
    // "localhost:5000",
    // "localhost:6000",
    // "localhost:9000"
    // "192.168.11.1:3000",
]
export const my_ip = "localhost:8000"
export const PORT = 8000

//ネットワーク設定
const server = http.createServer()
let io_server = new Server(server)
io_server.on("connection",(socket:Socket)=>{
    socket_server(io_server,socket)
})
export let client_sockets:any = []
search_connection_nodes(other_nodes)
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
            }
        ],
    },
]
const transaction_pool:transactions_data_interface[] = []
const now_diff = 3
const nance_char = "0"
export const max_connection_node = 2
//functions
export const get_hash = (data:string):string=>{
    const hash = createHash("sha256")
    hash.update(data)
    return hash.digest("hex")
}

export const add_chain = (index:number,data:block_data_interface)=>{
    // now_chain[index].push(data)
}
export const add_new_chain_branch = (data:block_data_interface)=>{
    // now_chain.push([data])
}


export const count_all_diff = (count_chain:block_data_interface[]):number=>{
        let all_diff:number = 0
        count_chain.forEach((i:block_data_interface)=>{
                all_diff+=i.nance_length**now_diff
        })
        return all_diff
}
const block_chain_proof = (chain_id:string,start_index:number):boolean=>{
    const target_chain:chain_data_interface|undefined = now_chain.find((i:chain_data_interface)=>i.chain_id === chain_id)
    if (target_chain){
        console.log(target_chain)
        //ブロックの後ろから整合性を確認
        for (let i:number = target_chain.data.length-1;i>0;i--){
            const {nance,...before_block_head} = target_chain.data[i-1]
            const before_block_hash_value = get_hash(String(nance)+JSON.stringify(before_block_head))
            if (before_block_hash_value !== target_chain.data[i].before_block_hash){
                return false
            }
        }
        //最後のブロックを検証
        const {nance,...last_block_head} = target_chain.data[target_chain.data.length-1]
        const last_block_head_hash_value = get_hash(String(nance)+JSON.stringify(last_block_head))
        if (last_block_head_hash_value.slice(0,now_diff) !== nance_char.repeat(now_diff)){
            return false
        }
        if (target_chain.root_block){
            return block_chain_proof(target_chain.root_block.chain_id,target_chain.root_block.block_num)
        }
        return true
    }else{
        return false
    }
}
//起動時にブロックチェーンの整合性確認

// console.log(count_all_diff(now_chain))
console.log(block_chain_proof("4cd3d5cd-8d33-457b-8313-2cc853d4f8ac",0))

// server.listen(PORT,()=>{
//     console.log(`This tsubame node is running!`)
//     console.log(`Now using ip:${my_ip}`)
//     if (now_chain.length > 1){
//         console.log("now chain status:\x1b[31mCompetitioning\x1b[0m")
//     }else{
//         console.log("now chain status:\x1b[32mNormal\x1b[0m")
//     }
// })
