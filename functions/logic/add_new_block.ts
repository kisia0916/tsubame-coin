import { block_data_interface } from "../../interfaces/block_data_interface";
import { add_chain, add_new_chain_branch, count_all_diff, get_hash, now_chain } from "../../main";

export const add_new_block = (data:block_data_interface,block_stream_flg:boolean)=>{
    //データ内のトランザクションの有効性の確認
    //............
    //以下ブロック追加ロジック
    
    // let max_chain_works:number = 0
    // for (let i = 0;now_chain.length>i;i++){
    //     const {nance,...before_block_head} = now_chain[i][data.block_num]
    //     const before_block_hash_value = get_hash(String(nance)+JSON.stringify(before_block_head))
    //     if (before_block_hash_value === data.before_block_hash){
    //         if (data.block_num === now_chain[i].length){
    //             add_chain(i,data)
    //         }else{

    //         }
    //     }else if (before_block_hash_value === ""){
    //         add_new_chain_branch(data)
    //     }
    //     const target_chain_works = count_all_diff(now_chain[i])
    //     max_chain_works = max_chain_works < target_chain_works?target_chain_works:max_chain_works
    // }
    //仕事量が最大のチェーンと比較して一定量以下のチェーンを削除

    //ほかのノードにブロック情報を伝達
    if (block_stream_flg){

    }
}