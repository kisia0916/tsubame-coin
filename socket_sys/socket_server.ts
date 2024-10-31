import { Socket } from "socket.io";
import { socket_send_data_interface } from "../interfaces/socket_send_data_interface";
import { convert_socket_send_type } from "../functions/convert_type";
import { add_client_sockets, client_sockets, max_connection_node, now_chain } from "../main";
import {io} from "socket.io-client"

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
        if ( req.data.block_num <= now_chain.length){
            io_server.to(socket.id).emit("get_target_block_response",convert_socket_send_type(now_chain[req.data.block_num-1]))
        }else{
            io_server.to(socket.id).emit("get_target_block_response",convert_socket_send_type(undefined))
        }
    })
}