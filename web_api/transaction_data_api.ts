import express, { json } from "express"
import { is_transaction_data, transactions_data_interface } from "../interfaces/transaction_data_interface"
import { add_transaction, get_hash, transaction_pool } from "../main"
import { check_transaction } from "../functions/logic/check_transaction"

const router = express.Router()

router.post("/add_new_transaction",async(req:any,res:any)=>{
    try{
        //トランザクションの有効性を確認
        if (is_transaction_data(req.body.transaction_data)){
            console.log(req.body.transaction_data)
            if (check_transaction(false,req.body.transaction_data as transactions_data_interface)){
                add_transaction(req.body.transaction_data as transactions_data_interface)
                console.log(transaction_pool)
                return res.status(200).json({data:"Transaction added!"})
            }else{
                return res.status(400).json({error:"bad request1"})
            }
        }else{
            return res.status(400).json({error:"bad request2"})
        }
    }catch(error){
        console.log(error)
        return res.status(500).json({error:"server error"})
    }
})

export default router