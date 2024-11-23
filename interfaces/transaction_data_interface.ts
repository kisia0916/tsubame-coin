export interface transactions_data_interface {
    address_transaction_ID:number,//ランダムな文字列//今までのこのアドレスのトランザクションで同じidが使用されていなければ認証成功（残高計算時に認証を行う）
    chain_id:string,
    transaction_num:number,
    from:string,//tsubame-coin-address
    to:string,
    amount:number,
    fee:number,//手数料
    signature:string,
    pub_key:string,
}

export const is_transaction_data = (data:any)=>{
    return (
        "block_num" in data &&
        typeof (data as transactions_data_interface).address_transaction_ID === "number"&&
        "chain_id" in data &&
        typeof (data as transactions_data_interface).chain_id === "string"&&
        "transaction_num," in data &&
        typeof (data as transactions_data_interface).transaction_num === "number"&&
        "from" in data &&
        typeof (data as transactions_data_interface).from === "string"&&
        "to" in data &&
        typeof (data as transactions_data_interface).to === "string"&&
        "amount" in data &&
        typeof (data as transactions_data_interface).amount === "number"&&
        "fee" in data &&
        typeof (data as transactions_data_interface).fee === "number"&&
        "signature" in data &&
        typeof (data as transactions_data_interface).signature === "string"&&
        "pub_key" in data &&
        typeof (data as transactions_data_interface).pub_key === "string"
    )
}