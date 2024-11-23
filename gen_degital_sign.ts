import { Buffer } from "buffer";
import { createHash,createSign,sign } from "crypto";
import { transactions_data_interface } from "./interfaces/transaction_data_interface";
import { check_transaction } from "./functions/logic/check_transaction";
import dotenv from "dotenv"
dotenv.config()

//重要
//ssh-keygenで生成した鍵はnode.jsのcryptでは使用できないので生成した秘密鍵と公開鍵をPKCS#1の形式に変換して使う
const data = {
    block_num:3,
    transaction_num:0,
    input:String(process.env.PUB_KEY),
    output:"hoge",
    amount:800,
    fee:10,
}
const hash_data = JSON.stringify(data)
const hash_data_value = createHash("SHA256").update(hash_data).digest("hex")

const private_key = String(process.env.PRIVATE_KEY)
const signer = createSign("SHA256")
signer.update(hash_data_value)
console.log(signer.sign(private_key,"base64"))


// console.log(Buffer.from(data.input,"base64").toString())
// console.log(check_transaction(data.input,hash_data_value,"Ywi/z34W87fmYTSN/YwpeivDcoXMY/rocXN2csTstvLihNsjLoIRevOTqWpWK70KduonfijrGV/gX+XVAx2dfDhQR6Dzc++xQJ4xy3fMVPZs/oOvxl4WYPFPVjf7TWLUcoeBxoOJpOCgyuFiodgVszQ4f8cYiFxOXx8pwc/CBUHIbjX4Vwh3NNn3DPoq+V22BXxX1LgTx71hhV3t0OANKumvFznnXcQCc8/hyWX7ggnEwC5Gwf7lYlBe2an+7GNU3XH6xAzMBkhdKMXjvdW767UVPppdJqUoHwXF1rbMqA2dntpOhAoC+rC6U9OhHecJWL7LXEn4iRGDE0w3cCKiqigtgPtJPCJ0uddk0bmmBlWnnUTjzaG9UhCcKY9uYZQaO8+UyA6Ko8PNsRhH+toXB4JgWRzSNQUQ3//i8xOVsb5snkyvdufYv67UDSoJgYq03Uvdl0CntWdXe8WxC+JKojxHRfCIFheU+x/cSDWkWdkq09CQBdbBIDEVXT5kTVX4"))
 