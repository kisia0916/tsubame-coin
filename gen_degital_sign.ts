import { Buffer } from "buffer";
import { createHash,createSign,sign } from "crypto";
import { transactions_data_interface } from "./interfaces/transaction_data_interface";
import { check_transaction } from "./functions/logic/check_transaction";
import dotenv from "dotenv"
dotenv.config()

//重要
//ssh-keygenで生成した鍵はnode.jsのcryptでは使用できないので生成した秘密鍵と公開鍵をPKCS#1の形式に変換して使う
const data = {
    address_transaction_ID:"5f03367c-1c47-4b95-9fb0-d02ae13cc8d2",
    chain_id:"9e7f0b28-5e1f-4f40-8f6f-c9b082886eca",
    from:"b204b03395647b7df320f19f6854fb2a1d6840eb",
    to:"2a4b15a73cf3bc6267c7c7121b736b3f6815759f",
    value:500,
    pub_key:"LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJDZ0tDQVFFQXJIUUNYd2NIcGVxRFp3UDFweXpUS3hqRGJaSFV3KzY0ZVFiSGlCamErWDVVT2N1RGFSZE0KcGYxU1F6eDJvTXVHZ0hzNi9wYlNKeUx3Vy95YU54UzJCdGh6UDVVT3BhVC85RDVPWlcxYUhKUE81cGZYaGxrNAp2eGI5M2JHN2RVZVpBZWIxaURBcm52RXVzbkxlbnI1REtMd3VWOXcyQ05sVnZSQk9hM3FWOVJ5amJLTmd4Q05NCmRxcjdqRHQvcm1WakJUTGtPYVU3MytORzExT0VucERSSTg0SGVTSTBDU0NxSjR4ZmVOQ2s2SWFaSC9WZ09zeXEKbTB1Mnc3YmxNbHRrdHBNMERiKzFUZWRMUTd4RzZQNHhoZzJwQWRUM3VzWFBPUFpqZk5CNlRwMDZhSC9RSHRzaAo1dGhoWStydXgwdlNEdnhhUzZUKyttNGJTVzdYU1JRdnJRSURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0=",
}
const hash_data = JSON.stringify(data)
const hash_data_value = createHash("SHA256").update(hash_data).digest("hex")
console.log(hash_data_value)

const private_key = String(process.env.PRIVATE_KEY)
const signer = createSign("SHA256")
signer.update(hash_data_value)
console.log(signer.sign(private_key,"base64"))


// console.log(Buffer.from(data.input,"base64").toString())
// console.log(check_transaction(data.input,hash_data_value,"Ywi/z34W87fmYTSN/YwpeivDcoXMY/rocXN2csTstvLihNsjLoIRevOTqWpWK70KduonfijrGV/gX+XVAx2dfDhQR6Dzc++xQJ4xy3fMVPZs/oOvxl4WYPFPVjf7TWLUcoeBxoOJpOCgyuFiodgVszQ4f8cYiFxOXx8pwc/CBUHIbjX4Vwh3NNn3DPoq+V22BXxX1LgTx71hhV3t0OANKumvFznnXcQCc8/hyWX7ggnEwC5Gwf7lYlBe2an+7GNU3XH6xAzMBkhdKMXjvdW767UVPppdJqUoHwXF1rbMqA2dntpOhAoC+rC6U9OhHecJWL7LXEn4iRGDE0w3cCKiqigtgPtJPCJ0uddk0bmmBlWnnUTjzaG9UhCcKY9uYZQaO8+UyA6Ko8PNsRhH+toXB4JgWRzSNQUQ3//i8xOVsb5snkyvdufYv67UDSoJgYq03Uvdl0CntWdXe8WxC+JKojxHRfCIFheU+x/cSDWkWdkq09CQBdbBIDEVXT5kTVX4"))
// ,?


