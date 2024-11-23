import express, { json } from "express"
import { is_transaction_data, transactions_data_interface } from "../interfaces/transaction_data_interface"
import { add_transaction, get_hash } from "../main"
import { check_transaction } from "../functions/logic/check_transaction"

const router = express.Router()

router.post("/add-new-transaction",async(req:any,res:any)=>{
    try{
        //トランザクションの有効性を確認
        if (is_transaction_data(req.body.transaction_data)){
            const {signature,...head} = req.body.transaction_data as transactions_data_interface
            const hash_transaction_head = get_hash(JSON.stringify(head))
            if (check_transaction(req.body.transaction_data as transactions_data_interface,head.pub_key,hash_transaction_head,signature)){
                add_transaction(req.body.transaction_data as transactions_data_interface)
                return res.start(200).json({data:"Transaction added!"})
            }else{
                return res.start(400).json({error:"bad request"})
            }
        }else{
            return res.start(400).json({error:"bad request"})
        }
    }catch{
        return res.status(500).json({error:"server error"})
    }
})

export default router