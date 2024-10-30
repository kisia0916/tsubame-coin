import {io} from "socket.io-client"
import { socket_send_data_interface } from "../interfaces/socket_send_data_interface"

let connected_num:number = 0
let connected_list = []
let counter:number = 0

export const search_connection_nodes = (node_list:string)=>{
    const tentative_socket:any = io(node_list[counter])
    tentative_socket.on("connect",()=>{
        tentative_socket.emit("get_now_connection_nodes_request",{data:""})
    })
    tentative_socket.on("get_now_connection_nodes_response",(res:socket_send_data_interface)=>{
        if (res.data.length < res.data.max){
            connected_list.push(tentative_socket)
        }
    })
}
export const socket_client = ()=>{

}