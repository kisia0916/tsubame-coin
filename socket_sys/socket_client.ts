import {io} from "socket.io-client"
import { socket_send_data_interface } from "../interfaces/socket_send_data_interface"
import { add_client_sockets, client_sockets, max_connection_node, my_ip } from "../main"

let connected_num:number = 0
let connected_list = []
let counter:number = 0

export const search_connection_nodes = (node_list:string[]):any=>{
    const tentative_socket:any = io(`http://${node_list[counter]}`)
    tentative_socket.on("connect",()=>{
        tentative_socket.emit("get_now_connection_nodes_request",{data:""})
    })
    tentative_socket.on("get_now_connection_nodes_response",(res:socket_send_data_interface)=>{
        if (res.data.length < res.data.max){
            connected_list.push(tentative_socket)
            connected_num+=1
            tentative_socket.emit("completed_connection_request",{data:{
                ip:my_ip
            }})
            add_client_sockets(tentative_socket)
            console.log(`done:${node_list[counter]}`)
            console.log(`now connection node:${connected_list.length}`)
        }else{
            tentative_socket.disconnect()
        }
        counter+=1
        if (connected_num < max_connection_node && counter < node_list.length){
            search_connection_nodes(node_list)
        }
    })
}
export const send_data_from_client = (client_socket:any,header:string,data:any)=>{
    client_socket.emit(header,data)
}