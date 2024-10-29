import { transactions_data_interface } from "./transaction_data_interface";

export interface block_data_interface extends block_head {
    nans:number,
}
export interface block_head {
    block_num:number,
    nans_length:number,
    transactions:transactions_data_interface[],
    before_block_hash:string,
}