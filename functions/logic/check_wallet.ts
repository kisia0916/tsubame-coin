import { now_chain } from "../../main"
import { get_now_main_chain } from "./count_all_diff"

export const count_wallet_content = (address:string)=>{
    const main_chain = get_now_main_chain()
    const chain_index = now_chain.findIndex((i)=>i.chain_id === main_chain.chain_id)
    let balance = 0
    for (let i = 0;now_chain[chain_index].data.length>i;i++){
        for (let t = 0;now_chain[chain_index].data[i].transactions.length>t;t++){
            const target_transaction = now_chain[chain_index].data[i].transactions[t]
            if (target_transaction.to === address){
                balance+=target_transaction.value
            }else if (target_transaction.from === address){
                balance-=target_transaction.value
            }
        }
    }
    console.log(`now balance:${balance}`)
}