import { Socket } from "socket.io";
import { socket_send_data_interface } from "../interfaces/socket_send_data_interface";
import { convert_socket_send_type } from "../functions/system/convert_type";
import { add_client_sockets, client_sockets, max_connection_node, now_chain } from "../main";
import {io} from "socket.io-client"
import { get_now_main_chain } from "../functions/logic/count_all_diff";
import { chain_data_interface } from "../interfaces/chain_data_interface";

export const socket_server = (io_server:any,socket:any)=>{
    socket.on("get_now_connection_nodes_request",(data:socket_send_data_interface)=>{
        io_server.to(socket.id).emit("get_now_connection_nodes_response",convert_socket_send_type({
            length:client_sockets.length,
            max:max_connection_node
        }))
    })
    socket.on("completed_connection_request",(res:socket_send_data_interface)=>{
        if (client_sockets.length < max_connection_node){
            const new_socket:any = io(`http://${res.data.ip}`)
            new_socket.on("connect",()=>{
                add_client_sockets(new_socket)
                console.log(`done2:${res.data.ip}`)
                console.log(`now connection node:${client_sockets.length}`)
            })
        }
    })
    socket.on("get_target_block_request",(req:{data:{block_num:number}})=>{
        if (req.data.block_num >= 0 && req.data.block_num <= now_chain.length){
            io_server.to(socket.id).emit("get_target_block_response",convert_socket_send_type(now_chain[req.data.block_num-1]))
        }else{
            io_server.to(socket.id).emit("get_target_block_response",convert_socket_send_type(undefined))
        }
    })
    socket.on("get_max_work_request",(req:any)=>{
        io_server.to(socket.id).emit("get_max_work_response",get_now_main_chain())
    })
    socket.on("sync_block_request",(req:{before_chain_id:string,before_block_num:number})=>{
        if (req.before_chain_id === ""){
            const first_branch = now_chain.find((i:chain_data_interface)=>i.root_block === undefined)
            if (first_branch){
                const {data,...chain_head} = first_branch
                io_server.to(socket.id).emit("sync_block_response",{type:"chain_data",chain_data:chain_head,block_data:undefined})
            }else{
                io_server.to(socket.id).emit("sync_block_response",{type:"chain_data",chain_data:undefined,block_data:undefined})
            }
        }else{
            const target_chain_index = now_chain.findIndex((i:chain_data_interface)=>i.chain_id === req.before_chain_id)
            if (target_chain_index !== -1){
                const {data,...chain_head} = now_chain[target_chain_index]
                if (req.before_block_num === -1){
                    io_server.to(socket.id).emit("sync_block_response",{type:"block_data",chain_data:chain_head,block_data:now_chain[target_chain_index].data[0]})
                }else if (req.before_block_num < now_chain[target_chain_index].data[now_chain[target_chain_index].data.length-1].block_num){
                    io_server.to(socket.id).emit("sync_block_response",{type:"block_data",chain_data:chain_head,block_data:now_chain[target_chain_index].data[req.before_block_num+1]})
                }else{
                    //次のチェーンデータを送信
                    if (target_chain_index < now_chain.length-1){
                        const next_chain_data = now_chain[target_chain_index+1]
                        const {data,...next_chain_head} = next_chain_data
                        io_server.to(socket.id).emit("sync_block_response",{type:"chain_data",chain_data:next_chain_head,block_data:undefined})
                    }else{
                        io_server.to(socket.id).emit("sync_blocks_done",{})
                        console.log("\x1b[32mSync blocks done!\x1b[0m")
                    }
                }
            }
        }
    })
}