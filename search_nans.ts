const befo = {
    block_num:3,
    nance_length:3,
    transactions:[],
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