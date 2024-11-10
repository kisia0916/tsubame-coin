import { createVerify } from "crypto";
export const check_transaction = (pub_key:string,hash_data:string,signature:string):boolean=>{
    /*
        hash:署名前のデータをsha256でハッシュ化したデータ
        pub_key:公開鍵
        signature:署名済みのデータ 
    */
    const verifier = createVerify("SHA256")
    verifier.update(hash_data)
    return verifier.verify(pub_key,signature,"base64")
}