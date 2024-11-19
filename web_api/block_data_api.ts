import express from "express";
import { get_now_main_chain } from "../functions/logic/count_all_diff";
import { get_hash, now_chain, now_diff } from "../main";
import { add_new_block } from "../functions/logic/add_new_block";
const router = express.Router()

router.get("/get-mining-target",async(req:any,res:any)=>{
    try{
        const now_main_chain = get_now_main_chain()
        const target_chain = now_chain.find((i)=>i.chain_id === now_main_chain.chain_id)
        if (target_chain){
            const before_block = target_chain.data[target_chain.data.length-1]
            const {nance,...before_block_head} = before_block
            const before_block_hash = get_hash(String(nance)+JSON.stringify(before_block_head))
            return res.status(200).json({data:{
                block_num:before_block.block_num+1,
                nance_length:now_diff,
                transactions:[],
                before_block_hash:before_block_hash
            }})
        }else{
            return res.status(404).json({error:"target_chain_not_found"})
        }
    }catch{
        return res.status(500).json({error:"server error"})
    }
})

router.post("/add_new_block",async(req:any,res:any)=>{
    try{
        await add_new_block(get_now_main_chain().chain_id,req.body.nance,true)
        return res.status(200).json({data:"sended"})
    }catch{
        return res.status(500).json({error:"server error"})
    }
})

export default router