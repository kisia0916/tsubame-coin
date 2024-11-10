const befo = {
    block_num:3,
    nance_length:3,
    transactions:[
        {
            block_num:3,
            transaction_num:0,
            input:``,
            output:"hoge",
            amount:600,
            fee:10,
            signature:"J9jy8oQ8ulxdkPEcAsmEfuSkg81uA2zd/tKeQAnVoBMCf382aoUnoV9XHmNCl40N0fV1mEZ3Y4p0x22zv3/ep5WzLsy12cap8lDRj6amwxU7f8it33Fxde1wvGnx7eIXxUCasIqhFVq1Tj1R1f+ymKSgEXZhwOy9iDY3VubgHxxHBV8zb202kLWYoEZSMgujm1hTY/qflQlNmqRlnoxw/oc5UQWPvkd75F8e0znT5N3HA6DJg9bor7ANUsk94adPS5pwuEmU7fqg1PgI12AlQUd6q5rhPM+JyBJJ3xBWtQMUclFTWByGMwufqacyyZ1BPxJph+x9kVQwCbwOaHs9jbcuWSRmqY3e9LJzzEIni4EvNFGDgPz5bIt2hApgZ9XDwcaSMOI5pfjWYBzcqEuJxeqjM2iJ5VJzCH3MQoksSkqCItiVG3wd8uiCbyOfQC0vqBXm7XzvpHjtQ57V8A+52GmiBiehjYqlImeKnIcZjLgqP4i1XQRVU1zleust/uib"
        }
    ],
    before_block_hash:"000134dae6ce42451ac0cf2e657199857995f4e4c9f9b707691b6850f5285f83",
}
const text = JSON.stringify(befo)

import { createHash } from "crypto"
let num = 0
while (true){
    const hash = createHash("sha256")
    const text_value = String(num)+text
    hash.update(text_value)
    const hash_value = hash.digest("hex")
    if (hash_value.slice(0,3) === "000"){
        console.log(hash_value)
        console.log(num)
        break
    }
    num+=1
}