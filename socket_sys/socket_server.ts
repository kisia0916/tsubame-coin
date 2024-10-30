import { Socket } from "socket.io";
import { socket_send_data_interface } from "../interfaces/socket_send_data_interface";
import { convert_socket_send_type } from "../functions/convert_type";
import { client_sockets, max_connection_node } from "../main";

export const socket_server = (io:any,socket:any)=>{
    socket.on("get_now_connection_nodes_request",(data:socket_send_data_interface)=>{
        io.to(socket.id).emit("get_now_connection_nodes_response",convert_socket_send_type({
            length:client_sockets.length,
            max:max_connection_node
        }))
    })
}