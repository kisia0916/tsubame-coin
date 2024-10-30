import {io} from "socket.io-client"
import { socket_send_data_interface } from "../interfaces/socket_send_data_interface"
import { max_connection_node, my_ip } from "../main"

let connected_num:number = 0
let connected_list = []
let counter:number = 0

export const search_connection_nodes = (node_list:string[]):any=>{
    console.log(node_list[counter])
    let flg:boolean = true
    const tentative_socket:any = io(`http://${node_list[counter]}`)
    tentative_socket.on("connect",()=>{
        console.log("con")
        tentative_socket.emit("get_now_connection_nodes_request",{data:""})
    })
    tentative_socket.on("get_now_connection_nodes_response",(res:socket_send_data_interface)=>{
        console.log("test2")
        counter+=1
        if (res.data.length < res.data.max){
            connected_list.push(tentative_socket)
            connected_num+=1
        }else{
            tentative_socket.disconnect()
            flg = false
        }

        if (connected_num < max_connection_node && counter < node_list.length){
            search_connection_nodes(node_list)
        }else{
            return connected_list
        }
    })
}

// if (flg){
//     console.log(my_ip)
//     tentative_socket.emit("completed_connection_request",{data:{
//         ip:my_ip
//     }})
//     search_connection_nodes(node_list)
//     console.log(`done:${node_list[counter]}`)
// }