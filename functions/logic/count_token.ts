import { now_chain } from "../../main"
import { get_now_main_chain } from "./count_all_diff"

export const count_token = (tsubame_address:string)=>{
    const main_chain = get_now_main_chain()
    const main_chain_index = now_chain.findIndex((i)=>i.chain_id === main_chain.chain_id)
    let token_counter:number = 0
    if (main_chain_index !== -1){
        now_chain[main_chain_index].data.forEach((i)=>{
            i.transactions.forEach((n)=>{
                if (n.from === tsubame_address){
                    token_counter-=n.fee
                }else if (n.to === tsubame_address){
                    token_counter+=n.fee
                }
            })
        })
    }
    return token_counter
}