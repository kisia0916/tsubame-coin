import { socket_send_data_interface } from "../../interfaces/socket_send_data_interface"

export const convert_socket_send_type = (data:any):socket_send_data_interface=>{
    return {data:data}
}