import dotenv from "dotenv"
import { createHash,createSign,sign } from "crypto";

dotenv.config()



const hash_data_value = createHash("SHA256").update(process.env.PUB_KEY as string).digest("hex")
const address = createHash("ripemd160").update(hash_data_value).digest("hex")

console.log(address)