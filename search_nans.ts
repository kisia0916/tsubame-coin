const befo =     {
    block_num:2,
    nans_length:3,
    transactions:[],
    before_block_hash:"0000ed44c3d574a33e8368db131bfb519818e71aab11553c4a73420c5b67e744",
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