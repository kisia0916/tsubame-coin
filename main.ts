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
import dotenv from "dotenv"
dotenv.config()

//fake_data
const other_nodes:string[] = [
    // "localhost:3000",
    // "localhost:5000",
    // "localhost:6000",
    // "localhost:9000"
    // "192.168.11.1:3000",
    "localhost:8000"
]
export const PORT = 3000
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
export const init_chain = ()=>{
    now_chain = []
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
        console.log("Start syncing.....")
        sync_blocks(client_sockets)
    },wait_connection_time)
    //ほかのノードとブロックを同期
    // add_new_block("9e7f0b28-5e1f-4f40-8f6f-c9b082886eca",{
    //     block_num:3,
    //     nance_length:3,
    //     transactions:[
    //         {
    //             block_num:3,
    //             transaction_num:0,
    //             input:"LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJpZ0tDQVlFQTN3UXF0R2hPK2NPaFlZRVg4SnlQS0FpaXg0YU15NEZEM2dld0Nua0JyK0ZEOE9CbXdmMzEKdEcraHBqbUVHMllrdHpaMGJtTXFZc3NVNDBjOU13L2laK3MxTzRjUVpQRkExbjBXazZYOUtlUzdwQThyU0tWdApLUmR6VVhmK0RTK1o1VHhSRi8wYitCWS9rcmg5RGQ2a1h5YlFQM2dBdEpROWl0cHRUVGlsOFRpSnZRMy9rTDh0CmlqVm51ZStlMkR0SkRhSloyWmFkemwvWXluN3pZeEQrSUxSSmpnR3BLaTZ5WXpuMEdTbXlJQmJZMDVQNzVUVkQKbkdKZHpYb2RCb29YUkUycE0zTzR5UXJqY2lnaUhpOTN6NzF5VE9aOWNhQy9sN3QwUnVkN0gwSzlGa0FjQTI5NwpjZmh4NXIvNnUyRzh0YndBVTZWUTZOeXpMU1ladnJFRTRvemhRN044ZWdRQitXajZwWENRaXhpcmM3NFljYmp4CjdKbndNeHdoN0Irc1ZHMXNJRVo0OENIOVBjVEZGb1RnU3E0d2k0R09CbTRJZVpCc2d0WjA0QzhpRXNaamRBbVAKWFNPeVZURklBSUJyaGg2eU9oYm11Ym5TWHpwVDlVOTNaY2xSZUJwYkFNa3R6RUh4K2c1dmNXSkNpMGdUTWl6eQpGamEyQ012S0NETmhBZ01CQUFFPQotLS0tLUVORCBSU0EgUFVCTElDIEtFWS0tLS0t",
    //             output:"hoge",
    //             amount:800,
    //             fee:10,
    //             signature:"vUrrQBX530/3GfXYVO8mCpcV085J/FwN0Cznb0h6qsO3JYRyCqA4viamJGTGTa/ZgTEjziFbpgIEOclHf1tmYalkYurNW6h2mU3P1QDm8QYIraS9kNcmEAD7t8ymLlIo0OzD+sDF7S5JrE0VdQD0Oc7I6K/sUUzpFcPtP9RbxfeW9pYrz8JIGfkN4CfofUpf05iCs5E36BQxRaf6jKaib3Etme/+pnyq4yWbFbbuG4v2mFcIXlvIGqoE91wCr/wPw9xGLJuroaZpT6Dm3a1PLSYiSyanwWqwfJm0l2vJku5OG9fFWobOXuW0XOLqino8lQKMtXUn+pBWgfljdKUoP1Rmv6x2JShQrOmWTiqT/WBIHVT+ZDrxNekrKPPR4ifdRUlo7cfbesTykT08f7LwOX8EqJrV/iegVQgtiMStrGA59n4ux5eBSvG+Q338T2Tp3SF2BuhEZcplDYP4Yd8WzTAMx5u0/DV4Mq0p+kQffiOxmLLCMax8FM/JYQzqwZuU"
    //         }
    //     ],
    //     before_block_hash:"000134dae6ce42451ac0cf2e657199857995f4e4c9f9b707691b6850f5285f83",
    //     nance:3377
    // },false)
})
