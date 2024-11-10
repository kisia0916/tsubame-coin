import { chain_data_interface } from "../../interfaces/chain_data_interface"
import { delete_blocks, delete_chain, now_chain, unit_chain } from "../../main"

export const delete_chain_branch = (chain_id:string)=>{
    const target_chain_index = now_chain.findIndex((i:chain_data_interface)=>i.chain_id === chain_id)
    if (target_chain_index !== -1){
        const target_chain = now_chain[target_chain_index]
        //削除するチェーンにルートブロックを持つチェーンを探索
        const other_branch_index = now_chain.findIndex((i:chain_data_interface)=>i.root_block?.chain_id === chain_id)
        if (other_branch_index !== -1){
            //ルートチェーンに結合
            const other_branch:chain_data_interface = now_chain[other_branch_index]
            delete_blocks(chain_id,Number(other_branch.root_block?.block_num)+1,target_chain.data.length-(Number(other_branch.root_block?.block_num)+1))
            delete_chain(other_branch.chain_id)
            unit_chain(now_chain[target_chain_index],other_branch)
        }else{
            delete_chain(chain_id)
        }
    }
}