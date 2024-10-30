import { Socket } from "socket.io";
import { socket_send_data_interface } from "../interfaces/socket_send_data_interface";
import { convert_socket_send_type } from "../functions/convert_type";
import { add_client_sockets, client_sockets, max_connection_node } from "../main";
import {io} from "socket.io-client"

export const socket_server = (io_server:any,socket:any)=>{
    socket.on("get_now_connection_nodes_request",(data:socket_send_data_interface)=>{
        console.log("tset")
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
                console.log(`done:${res.data.ip}`)
            })
        }
    })
}