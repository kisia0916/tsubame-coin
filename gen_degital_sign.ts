import { createHash,createSign,sign } from "crypto";
import { transactions_data_interface } from "./interfaces/transaction_data_interface";
import { check_transaction } from "./functions/logic/check_transaction";

//重要
//ssh-keygenで生成した鍵はnode.jsのcryptでは使用できないので生成した秘密鍵と公開鍵をPKCS#1の形式に変換して使う

const data = {
    block_num:2,
    transaction_num:0,
    input:``,
    output:"hoge",
    amount:800,
    fee:10,
}
const hash_data = JSON.stringify(data)
const hash_data_value = createHash("SHA256").update(hash_data).digest("hex")

const private_key = ``

const signer = createSign("SHA256")
signer.update(hash_data_value)
console.log(signer.sign(private_key,"base64"))

console.log(check_transaction(data.input,hash_data_value,"J9jy8oQ8ulxdkPEcAsmEfuSkg81uA2zd/tKeQAnVoBMCf382aoUnoV9XHmNCl40N0fV1mEZ3Y4p0x22zv3/ep5WzLsy12cap8lDRj6amwxU7f8it33Fxde1wvGnx7eIXxUCasIqhFVq1Tj1R1f+ymKSgEXZhwOy9iDY3VubgHxxHBV8zb202kLWYoEZSMgujm1hTY/qflQlNmqRlnoxw/oc5UQWPvkd75F8e0znT5N3HA6DJg9bor7ANUsk94adPS5pwuEmU7fqg1PgI12AlQUd6q5rhPM+JyBJJ3xBWtQMUclFTWByGMwufqacyyZ1BPxJph+x9kVQwCbwOaHs9jbcuWSRmqY3e9LJzzEIni4EvNFGDgPz5bIt2hApgZ9XDwcaSMOI5pfjWYBzcqEuJxeqjM2iJ5VJzCH3MQoksSkqCItiVG3wd8uiCbyOfQC0vqBXm7XzvpHjtQ57V8A+52GmiBiehjYqlImeKnIcZjLgqP4i1XQRVU1zleust/uib"))