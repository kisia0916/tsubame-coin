const befo = {
    block_num:3,
    nance_length:3,
    transactions:[
        {
            block_num:3,
            transaction_num:0,
            input:"LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJpZ0tDQVlFQTN3UXF0R2hPK2NPaFlZRVg4SnlQS0FpaXg0YU15NEZEM2dld0Nua0JyK0ZEOE9CbXdmMzEKdEcraHBqbUVHMllrdHpaMGJtTXFZc3NVNDBjOU13L2laK3MxTzRjUVpQRkExbjBXazZYOUtlUzdwQThyU0tWdApLUmR6VVhmK0RTK1o1VHhSRi8wYitCWS9rcmg5RGQ2a1h5YlFQM2dBdEpROWl0cHRUVGlsOFRpSnZRMy9rTDh0CmlqVm51ZStlMkR0SkRhSloyWmFkemwvWXluN3pZeEQrSUxSSmpnR3BLaTZ5WXpuMEdTbXlJQmJZMDVQNzVUVkQKbkdKZHpYb2RCb29YUkUycE0zTzR5UXJqY2lnaUhpOTN6NzF5VE9aOWNhQy9sN3QwUnVkN0gwSzlGa0FjQTI5NwpjZmh4NXIvNnUyRzh0YndBVTZWUTZOeXpMU1ladnJFRTRvemhRN044ZWdRQitXajZwWENRaXhpcmM3NFljYmp4CjdKbndNeHdoN0Irc1ZHMXNJRVo0OENIOVBjVEZGb1RnU3E0d2k0R09CbTRJZVpCc2d0WjA0QzhpRXNaamRBbVAKWFNPeVZURklBSUJyaGg2eU9oYm11Ym5TWHpwVDlVOTNaY2xSZUJwYkFNa3R6RUh4K2c1dmNXSkNpMGdUTWl6eQpGamEyQ012S0NETmhBZ01CQUFFPQotLS0tLUVORCBSU0EgUFVCTElDIEtFWS0tLS0t",
            output:"hoge",
            amount:800,
            fee:10,
            signature:"vUrrQBX530/3GfXYVO8mCpcV085J/FwN0Cznb0h6qsO3JYRyCqA4viamJGTGTa/ZgTEjziFbpgIEOclHf1tmYalkYurNW6h2mU3P1QDm8QYIraS9kNcmEAD7t8ymLlIo0OzD+sDF7S5JrE0VdQD0Oc7I6K/sUUzpFcPtP9RbxfeW9pYrz8JIGfkN4CfofUpf05iCs5E36BQxRaf6jKaib3Etme/+pnyq4yWbFbbuG4v2mFcIXlvIGqoE91wCr/wPw9xGLJuroaZpT6Dm3a1PLSYiSyanwWqwfJm0l2vJku5OG9fFWobOXuW0XOLqino8lQKMtXUn+pBWgfljdKUoP1Rmv6x2JShQrOmWTiqT/WBIHVT+ZDrxNekrKPPR4ifdRUlo7cfbesTykT08f7LwOX8EqJrV/iegVQgtiMStrGA59n4ux5eBSvG+Q338T2Tp3SF2BuhEZcplDYP4Yd8WzTAMx5u0/DV4Mq0p+kQffiOxmLLCMax8FM/JYQzqwZuU"
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