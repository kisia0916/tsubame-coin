import { transactions_data_interface } from "./transaction_data_interface";

export interface block_data_interface extends block_head {
    nance:number,
}
export interface block_head {
    block_num:number,
    nance_length:number,
    transactions:transactions_data_interface[],
    before_block_hash:string,
}