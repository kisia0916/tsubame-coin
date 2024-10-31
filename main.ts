import { createHash } from "crypto";
import { block_data_interface } from "./interfaces/block_data_interface";
import { transactions_data_interface } from "./interfaces/transaction_data_interface";
import {Server,Socket} from "socket.io"
import { io } from "socket.io-client"
import http from "http"
import { socket_server } from "./socket_sys/socket_server";
import { search_connection_nodes } from "./socket_sys/socket_client";


//fake_data
const other_nodes:string[] = [
    "localhost:3000",
    "localhost:5000",
    "localhost:6000",
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
export const now_chain:block_data_interface[] = [
    {
        block_num:0,
        nans_length:3,
        transactions:[],
        before_block_hash:"",
        nans:4707,
    },
    {
        block_num:1,
        nans_length:3,
        transactions:[],
        before_block_hash:"0003b91235533d4626780b1b3a4407029ead287bc2fdbcbcf134512ebe07b1ac",
        nans:9297,
    },
    {
        block_num:2,
        nans_length:3,
        transactions:[],
        before_block_hash:"0000ed44c3d574a33e8368db131bfb519818e71aab11553c4a73420c5b67e744",
        nans:302,
    }
]
const transaction_pool:transactions_data_interface[] = []
const now_diff = 3
const nans_char = "0"
export const max_connection_node = 2
//functions
const get_hash = (data:string):string=>{
    const hash = createHash("sha256")
    hash.update(data)
    return hash.digest("hex")
}

const count_all_diff = (count_chain:block_data_interface[]):number=>{
        let all_diff:number = 0
        count_chain.forEach((i:block_data_interface)=>{
                all_diff+=i.nans_length**now_diff
        })
        return all_diff
}
const block_chain_proof = (data:block_data_interface[]):boolean=>{
    let {nans,...before_block_data} = data[0]
    let  before_block_nans = data[0].nans
    let flg:boolean = true
    for (let i = 1;now_chain.length>i;i++){
        const hash_value:string = get_hash(String(before_block_nans)+JSON.stringify(before_block_data))
        if (hash_value !== data[i].before_block_hash || hash_value.slice(0,data[i-1].nans_length) !== nans_char.repeat(data[i-1].nans_length)){
            flg = false
            break
        }
        const {nans,...next_block_data} = data[i]
        before_block_data = next_block_data
        before_block_nans = data[i].nans
    }
    //最後のブロック検証
    const hash_value:string = get_hash(String(before_block_nans)+JSON.stringify(before_block_data))
    if (hash_value.slice(0,data[data.length-1].nans_length) !== nans_char.repeat(data[data.length-1].nans_length)){
        flg = false
    }
    return flg
}
//起動時にブロックチェーンの整合性確認

console.log(count_all_diff(now_chain))
console.log(block_chain_proof(now_chain))

server.listen(PORT,()=>{
    console.log(`This tsubame node is running!`)
    console.log(`Now using ip:${my_ip}`)
})