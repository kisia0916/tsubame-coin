import dotenv from "dotenv"
dotenv.config()
console.log(Buffer.from(process.env.PUB_KEY as string).toString("base64"))