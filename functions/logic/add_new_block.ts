import { block_data_interface } from "../../interfaces/block_data_interface";
import { chain_data_interface } from "../../interfaces/chain_data_interface";
import { add_chain, add_new_chain_branch, delete_works_difference, get_hash, now_chain } from "../../main";
import { count_all_diff } from "./count_all_diff";
import { delete_chain_branch } from "./delete_chain_branch";

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
        let max_works:number = 0
        let work_list:{chain_id:string,all_diff:number}[] = []
        now_chain.forEach((i:chain_data_interface)=>{
            const chain_all_works = count_all_diff(i.chain_id,-1)
            work_list.push({chain_id:i.chain_id,all_diff:chain_all_works})
            max_works = max_works<chain_all_works?chain_all_works:max_works
        })
        console.log(work_list)
        now_chain.forEach((i:chain_data_interface,index:number)=>{
            if (max_works-work_list[index].all_diff >= delete_works_difference){
                delete_chain_branch(i.chain_id)
            }
        })
        console.log(now_chain[0])
        //ほかのノードにブロック情報を伝達
        if (block_stream_flg){

        }
    }
}