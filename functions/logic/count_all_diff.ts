import { chain_data_interface } from "../../interfaces/chain_data_interface"
import { now_chain, now_diff } from "../../main"

export const count_all_diff = (chain_id:string,index:number):number=>{
    let all_diff:number = 0
    const target_chain = now_chain.find((i:chain_data_interface)=>i.chain_id === chain_id)
    if (target_chain){
        if (index === -1){
            index = target_chain.data.length-1
        }
        for (let i = 0;index>=i;i++){
            all_diff+=target_chain.data[i].nance_length**now_diff
        }
        if (target_chain.root_block){
            all_diff += count_all_diff(target_chain.root_block.chain_id,target_chain.root_block.block_num)
        }
    }
    return all_diff
}