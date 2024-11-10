export interface transactions_data_interface {
    block_num:number,
    transaction_num:number,
    input:string,
    output:string,
    amount:number,
    fee:number,//手数料
    signature:string,
}