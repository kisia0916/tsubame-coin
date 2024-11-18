import { block_data_interface } from "../../interfaces/block_data_interface";
import { chain_data_interface } from "../../interfaces/chain_data_interface";
import { transactions_data_interface } from "../../interfaces/transaction_data_interface";
import { add_block_chain, add_new_chain_branch, delete_works_difference, get_hash, nance_char, now_chain } from "../../main";
import { check_transaction } from "./check_transaction";
import { count_all_diff } from "./count_all_diff";
import { delete_chain_branch } from "./delete_chain_branch";

export const add_new_block = (chain_id:string,data:block_data_interface,block_stream_flg:boolean)=>{
    console.log(chain_id)
    const target_chain_index = now_chain.findIndex((i:chain_data_interface)=>i.chain_id === chain_id)
    if (target_chain_index !== -1){
        const target_chain:chain_data_interface = now_chain[target_chain_index]
        //データ内のトランザクションの有効性の確認
        for (let m:number = 0;data.transactions.length>m;m++){
            const {signature,...transaction_data} = data.transactions[m]
            const transaction_hash_value = get_hash(JSON.stringify(transaction_data))
            const is_true_transaction = check_transaction(transaction_data.input,transaction_hash_value,signature)
            if (transaction_data.block_num !== data.block_num || transaction_data.transaction_num !== m || is_true_transaction === false){
                console.log("verify error")
                return 0
            }
        }
        console.log("all transaction is true")
        //以下ブロック追加ロジック
        if (now_chain[target_chain_index].data.length>0){
            const target_block_index = data.block_num > target_chain.data.length-1?target_chain.data.length-1:data.block_num
            const {nance,...before_block_head} = now_chain[target_chain_index].data[target_block_index]
            const before_block_head_hash_value = get_hash(String(nance)+JSON.stringify(before_block_head))
            //追加するブロック自体の有効性の確認
            if (before_block_head_hash_value === data.before_block_hash){
                const {nance,...add_block_head} = data
                const add_block_head_hash_value = get_hash(String(nance)+JSON.stringify(add_block_head))
                console.log(add_block_head)
                if (add_block_head_hash_value.slice(0,data.nance_length) !== nance_char.repeat(data.nance_length)){
                    return
                }
                if (data.block_num > target_chain.data.length-1){
                    add_block_chain(chain_id,data)
                }else{
                    add_new_chain_branch({
                        chain_id:now_chain[target_block_index].chain_id,
                        block_num:data.block_num-1
                    },data)
                }
            }else{
                return
            }
        }else{
            const {nance,...add_block_head} = data
            const add_block_head_hash_value = get_hash(String(nance)+JSON.stringify(add_block_head))
            console.log(add_block_head)
            if (add_block_head_hash_value.slice(0,data.nance_length) !== nance_char.repeat(data.nance_length)){
                return
            }
            add_block_chain(chain_id,data)
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
                console.log(i.chain_id)
                delete_chain_branch(i.chain_id)
            }
        })
        console.log(now_chain)
        //ほかのノードにブロック情報を伝達
        if (block_stream_flg){

        }
    }
}