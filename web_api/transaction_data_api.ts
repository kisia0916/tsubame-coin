import express from "express"

const router = express.Router()

router.post("/add-new-transaction",async(req:any,res:any)=>{
    try{
        
    }catch{
        return res.status(500).json({error:"server error"})
    }
})

export default router