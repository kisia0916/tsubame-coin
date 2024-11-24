export interface transactions_data_interface {
    address_transaction_ID:string,//ランダムな文字列//今までのこのアドレスのトランザクションで同じidが使用されていなければ認証成功（残高計算時に認証を行う）
    chain_id:string,
    from:string,//tsubame-coin-address
    to:string,
    value:number,
    signature:string,
    pub_key:string,
}

export const is_transaction_data = (data:any)=>{
    return (
        "address_transaction_ID" in data &&
        typeof (data as transactions_data_interface).address_transaction_ID === "string"&&
        "chain_id" in data &&
        typeof (data as transactions_data_interface).chain_id === "string"&&
        "from" in data &&
        typeof (data as transactions_data_interface).from === "string"&&
        "to" in data &&
        typeof (data as transactions_data_interface).to === "string"&&
        "value" in data &&
        typeof (data as transactions_data_interface).value === "number"&&
        "signature" in data &&
        typeof (data as transactions_data_interface).signature === "string"&&
        "pub_key" in data &&
        typeof (data as transactions_data_interface).pub_key === "string"
    )
}