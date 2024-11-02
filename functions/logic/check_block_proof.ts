import { chain_data_interface } from "../../interfaces/chain_data_interface"
import { get_hash, nance_char, now_chain } from "../../main"

export const check_block_chain_proof = (chain_id:string,last_hash:string,index:number):boolean=>{
    //  ブロックの番号が連番になっているか追加する処理を書く
    //.............
    const target_chain:chain_data_interface|undefined = now_chain.find((i:chain_data_interface)=>i.chain_id === chain_id)
    if (target_chain){
        const start_index = index >= 0?index:target_chain.data.length-1
        //最後のブロックを検証
        const {nance,...last_block_head} = target_chain.data[start_index]
        const last_block_head_hash_value = get_hash(String(nance)+JSON.stringify(last_block_head))
        if (last_hash){
            if (last_block_head_hash_value !== last_hash){
                return false
            }
        }else if (last_block_head_hash_value.slice(0,last_block_head.nance_length) !== nance_char.repeat(last_block_head.nance_length)){
            return false
        }
        //ブロックの後ろから整合性を確認
        for (let i:number = start_index;i>0;i--){
            const {nance,...before_block_head} = target_chain.data[i-1]
            const before_block_hash_value = get_hash(String(nance)+JSON.stringify(before_block_head))
            if (before_block_hash_value !== target_chain.data[i].before_block_hash){
                return false
            }
        }
        if (target_chain.root_block){
            return check_block_chain_proof(target_chain.root_block.chain_id,target_chain.data[0].before_block_hash,target_chain.root_block.block_num)
        }
        return true
    }else{
        return false
    }
}