import dotenv from "dotenv"
dotenv.config()
const befo = {
    block_num:0,
    nance_length:3,
    transactions:[
        {
            address_transaction_ID:"fbe142c4-4631-4a4e-b077-4f6ed8547667",
            chain_id:"9e7f0b28-5e1f-4f40-8f6f-c9b082886eca",
            from:"",
            to:"b204b03395647b7df320f19f6854fb2a1d6840eb",
            value:1000,
            pub_key:String(Buffer.from(process.env.PUB_KEY as string).toString("base64")),
            signature:"M3gVP19pjlZsCyElpOOxPOA7fX8iZqUzyqBNpFSro/SjBB9F4/7miQ9r3ozSP5LPmk88balRkERFoQ7PqNL485r5LfmqeCDko1rbViu3sjTcElY+nxMXDleeiLa61w4SQvSR1SA0M/cqBttftHJy1L/LAuR0KDxKtDBIWHVa3QE0dJYPKey/IWOFszqRH2Ho3g96mexkEjgJntvSAMI3AFpF4ksQQoPs86dPEMYO6S1QNO7+OBDgwkCkw6jT7Yf53zjxToJXkQMfs55SN8NBMQGr27GjpBvpobwAQjtERz2ngerQ3sO0hthVKGFpFhWfywNXmH3vBUMpcSyZ0Jo/vorvDotvFJwHngwIrlhHF6EmxK2LzxukJ6ikEE3Wd4FQALGt8Zpnj3UMOvjOlZtSBMmOkjdah8ci/Jc3gGTEyWfprgPjxRITzQSqY6C8Jyydy6ARyFjYXH/udHGR4XjW8A9SVV3InrOWJGZw5xNRfI9hsnpaguYf03Gf2hLXL/Mu"
        }
    ],
    before_block_hash:"",
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