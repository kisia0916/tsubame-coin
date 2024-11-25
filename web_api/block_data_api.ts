import express from "express";
import { get_now_main_chain } from "../functions/logic/count_all_diff";
import { block_transaction_capacity, get_hash, now_block_template, now_chain, now_diff, set_block_template, transaction_pool } from "../main";
import { add_new_block } from "../functions/logic/add_new_block";
const router = express.Router()

router.get("/get_mining_target",async(req:any,res:any)=>{
    try{
        if (now_block_template === undefined){
            const now_main_chain = get_now_main_chain()
            const target_chain = now_chain.find((i)=>i.chain_id === now_main_chain.chain_id)
            if (target_chain){
                const before_block = target_chain.data[target_chain.data.length-1]
                const {nance,...before_block_head} = before_block
                const before_block_hash = get_hash(String(nance)+JSON.stringify(before_block_head))
                //ブロックに追加するトランザクションを選択
                transaction_pool.sort((a,b)=>b.value-a.value)
                const target_transactions = transaction_pool.slice(0,block_transaction_capacity)
                const res_data = {
                    block_num:before_block.block_num+1,
                    nance_length:now_diff,
                    transactions:target_transactions,
                    before_block_hash:before_block_hash
                }
                set_block_template(res_data)
                res.setHeader("Content-Disposition",'attachment; filename="next_block.json"')
                res.setHeader("Content-Type",'application/json')
                res.send(JSON.stringify(res_data))
            }else{
                return res.status(404).json({error:"target_chain_not_found"})
            }
        }else{
            res.send(JSON.stringify(now_block_template))
        }
    }catch{
        return res.status(500).json({error:"server error"})
    }
})

router.post("/add_new_block",async(req:any,res:any)=>{
    try{
        await add_new_block(get_now_main_chain().chain_id,req.body.nance,true)//ここ第二引数間違ってる
        set_block_template(undefined)
        return res.status(200).json({data:"sended"})
    }catch{
        return res.status(500).json({error:"server error"})
    }
})

export default router