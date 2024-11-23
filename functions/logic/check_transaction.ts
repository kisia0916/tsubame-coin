import { Buffer } from "buffer";
import { createVerify } from "crypto";
import { get_now_main_chain } from "./count_all_diff";
import { now_chain, transaction_pool } from "../../main";
import { transactions_data_interface } from "../../interfaces/transaction_data_interface";
export const check_transaction = (transaction:transactions_data_interface,pub_key:string,hash_data:string,signature:string):boolean=>{
    /*
        hash:署名前のデータをsha256でハッシュ化したデータ
        pub_key:公開鍵
        signature:署名済みのデータ 
    */
   //残高とトランザクションIDの検証
    const main_chain = get_now_main_chain()
    let balance:number = 0
    const chain_index = now_chain.findIndex((i)=>i.chain_id === main_chain.chain_id)
    if (chain_index !== -1){
        for (let i = 0;now_chain[chain_index].data.length>i;i++){
            for (let t = 0;now_chain[chain_index].data[i].transactions.length>t;t++){
                const target_transaction = now_chain[chain_index].data[i].transactions[t]
                if (target_transaction.to === transaction.from){
                    balance+=target_transaction.fee
                }else if (target_transaction.from === transaction.from){
                    balance-=target_transaction.fee
                }
                if (target_transaction.address_transaction_ID === transaction.address_transaction_ID){
                    return false
                }
            }
        }
        //トランザクションプール内に同じIDのトランザクションがないか検証
        for (let i = 0;transaction_pool.length>i;i++){
            if (transaction_pool[i].address_transaction_ID === transaction.address_transaction_ID){
                return false
            }
        }
        if (balance < transaction.fee){
            return false
        }
    }
    const decoded_pub_key = Buffer.from(pub_key,"base64").toString()
    const verifier = createVerify("SHA256")
    verifier.update(hash_data)
    return verifier.verify(decoded_pub_key,signature,"base64")
}