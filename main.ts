import { createHash } from "crypto";
import { block_data_interface, block_head } from "./interfaces/block_data_interface";
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
import dotenv from "dotenv"

//web api
import express from "express"
import block_data from "./web_api/block_data_api"
import transaction_data from "./web_api/transaction_data_api"
import { count_wallet_content } from "./functions/logic/check_wallet";
const app:express.Express = express()

dotenv.config()

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
                transactions:[
                    {
                        address_transaction_ID:"fbe142c4-4631-4a4e-b077-4f6ed8547667",
                        chain_id:"9e7f0b28-5e1f-4f40-8f6f-c9b082886eca",
                        from:"",
                        to:"b204b03395647b7df320f19f6854fb2a1d6840eb",
                        value:1000,
                        pub_key:String(Buffer.from(process.env.PUB_KEY as string).toString("base64")),
                        signature:"M3gVP19pjlZsCyElpOOxPOA7fX8iZqUzyqBNpFSro/SjBB9F4/7miQ9r3ozSP5LPmk88balRkERFoQ7PqNL485r5LfmqeCDko1rbViu3sjTcElY+nxMXDleeiLa61w4SQvSR1SA0M/cqBttftHJy1L/LAuR0KDxKtDBIWHVa3QE0dJYPKey/IWOFszqRH2Ho3g96mexkEjgJntvSAMI3AFpF4ksQQoPs86dPEMYO6S1QNO7+OBDgwkCkw6jT7Yf53zjxToJXkQMfs55SN8NBMQGr27GjpBvpobwAQjtERz2ngerQ3sO0hthVKGFpFhWfywNXmH3vBUMpcSyZ0Jo/vorvDotvFJwHngwIrlhHF6EmxK2LzxukJ6ikEE3Wd4FQALGt8Zpnj3UMOvjOlZtSBMmOkjdah8ci/Jc3gGTEyWfprgPjxRITzQSqY6C8Jyydy6ARyFjYXH/udHGR4XjW8A9SVV3InrOWJGZw5xNRfI9hsnpaguYf03Gf2hLXL/Mu"
                    }
                ],
                before_block_hash:"",
                nance:8287,
            },
        ],
    },
]
export let transaction_pool:transactions_data_interface[] = []
export const now_diff = 3
export const nance_char = "0"
export const max_connection_node = 2
export const delete_works_difference = (now_diff**2)*1
export let now_longest_chain:string = ""
export let now_block_reward = 300
export const block_transaction_capacity = 10
export let now_block_template:block_head|undefined = undefined
//functions
export const init_chain = ()=>{
    now_chain = []
}
export const set_block_template = (new_template:block_head|undefined)=>{
    now_block_template = new_template
}
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
    now_chain.push({
        chain_id:data.chain_id,
        data:data.data,
        root_block:data.root_block
    })
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
export const add_transaction = (data:transactions_data_interface)=>{
    transaction_pool.push(data)
}

//起動時にブロックチェーンの整合性確認

console.log(`chain proof:${check_block_chain_proof("4cd3d5cd-8d33-457b-8313-2cc853d4f8ac","",-1)}`)
console.log(`chain all diff:${count_all_diff("9e7f0b28-5e1f-4f40-8f6f-c9b082886eca",-1)}`)
count_wallet_content("b204b03395647b7df320f19f6854fb2a1d6840eb")
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
        console.log("Start syncing.....")
        sync_blocks(client_sockets)
    },wait_connection_time)
})


app.use(express.json())
app.use("/block_data",block_data)
app.use("/transaction_data",transaction_data)


app.listen(3001,()=>{
    console.log("api server is running")
})