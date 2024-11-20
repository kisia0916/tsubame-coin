export interface transactions_data_interface {
    block_num:number,
    transaction_num:number,
    from:string,//tsubame-coin-address
    to:string,
    amount:number,
    fee:number,//手数料
    signature:string,
    pub_key:string
}