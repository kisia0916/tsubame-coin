import { block_data_interface } from "../../interfaces/block_data_interface";
import { chain_data_interface } from "../../interfaces/chain_data_interface";
import { add_chain, add_new_chain_branch, count_all_diff, get_hash, now_chain } from "../../main";

export const add_new_block = (chain_id:string,index:number,data:block_data_interface,block_stream_flg:boolean)=>{
    console.log(chain_id)
    const target_chain_index = now_chain.findIndex((i:chain_data_interface)=>i.chain_id === chain_id)
    if (target_chain_index !== -1){
        //データ内のトランザクションの有効性の確認
        //............
        //以下ブロック追加ロジック
        const target_block_index = index === -1?now_chain[target_chain_index].data.length-1:index
        const {nance,...before_block_head} = now_chain[target_chain_index].data[target_block_index]
        const before_block_head_hash_value = get_hash(String(nance)+JSON.stringify(before_block_head))
        if (before_block_head_hash_value === data.before_block_hash){
            if (index === -1){
                add_chain(chain_id,data)
            }else{
                add_new_chain_branch({
                    chain_id:now_chain[target_block_index].chain_id,
                    block_num:index
                },data)
            }
        }
        //仕事量が最大のチェーンと比較して一定量以下のチェーンを削除

        //ほかのノードにブロック情報を伝達
        if (block_stream_flg){

        }
    }
}