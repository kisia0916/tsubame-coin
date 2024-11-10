import { block_data_interface } from "./block_data_interface"

export interface chain_data_interface {
    chain_id:string
    root_block:{chain_id:string,block_num:number}|undefined,
    data:block_data_interface[],
}