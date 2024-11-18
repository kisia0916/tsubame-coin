import { block_data_interface } from "../../interfaces/block_data_interface"
import { chain_data_interface } from "../../interfaces/chain_data_interface"
import { create_new_chain, init_chain, now_chain } from "../../main"
import { send_data_from_client } from "../../socket_sys/socket_client"
import { add_new_block } from "./add_new_block"
import { count_all_diff, get_now_main_chain } from "./count_all_diff"

export const sync_blocks = async(client_sockets:any[])=>{
    //接続しているすべてノードから最も仕事量の大きなチェーンの仕事量を取得
    let max_work_node_socket:any = undefined
    let max_work = -1
    let nodes_diff:{work:number,socket:number}[] = await Promise.all(client_sockets.map(async(i:any)=>{
        return new Promise((resolve, reject)=>{
            send_data_from_client(i,"get_max_work_request",{})
            const time_out = setTimeout(()=>{
                reject({work:-1,socket:i})
            },3000)
            i.on("get_max_work_response",(res:{chain_id:string,max_work:number})=>{
                clearTimeout(time_out)
                resolve({work:res.max_work,socket:i})
            }) 
        })
    }))
    if (nodes_diff.length>0){
        nodes_diff.sort((a,b)=>b.work-a.work)
        max_work = nodes_diff[0].work
        max_work_node_socket = nodes_diff[0].socket
        if (get_now_main_chain().max_work<=max_work){
            console.log("syncing....")
            send_data_from_client(max_work_node_socket,"sync_block_request",{before_chain_id:"",before_block_num:-1})
            max_work_node_socket.on("sync_block_response",(res:{type:"chain_data"|"block_data",chain_data:chain_data_interface,block_data:block_data_interface})=>{
                try{
                    if (res.type === "chain_data" && res.chain_data){
                        res.chain_data.data = []
                        create_new_chain(res.chain_data)
                        console.log(now_chain)
                        console.log(res.chain_data)
                        send_data_from_client(max_work_node_socket,"sync_block_request",{before_chain_id:res.chain_data.chain_id,before_block_num:-1})
                    }else if (res.type === "block_data" && res.block_data){
                        //ブロックを追加
                        add_new_block(res.chain_data.chain_id,res.block_data,false)
                        console.log(now_chain)
                        console.log("================= Block addition complete ==================")
                        setTimeout(()=>{
                            send_data_from_client(max_work_node_socket,"sync_block_request",{before_chain_id:res.chain_data.chain_id,before_block_num:res.block_data.block_num})
                        },1000)
                    }
                }catch(error){
                    console.log("sync error")
                    //同期するノードを切り替え
                    //チェーンの初期化
                    init_chain()
                    nodes_diff.splice(0,1)
                    const next_socket_list = nodes_diff.map((i)=>{
                        return i.socket
                    })
                    sync_blocks(next_socket_list)
                }
            })
        }
        max_work_node_socket.on("sync_blocks_done",(data:any)=>{
            const count_diff_result = get_now_main_chain()
            if (count_diff_result.max_work < nodes_diff[0].work){
                console.log("sync error")
                //同期するノードを切り替え
                //チェーンの初期化
                init_chain()
                nodes_diff.splice(0,1)
                const next_socket_list = nodes_diff.map((i)=>{
                    return i.socket
                })
                sync_blocks(next_socket_list)
            }else{
                console.log("\x1b[32mSync blocks done!\x1b[0m")
            }
        })
    }
    //最も仕事量の多いチェーンがあるノードのチェーンデータと同期
    //同期したチェーンの仕事量が偽造されていないことを確認し、偽造を検知したらそのデータを破棄し二番目の仕事量のノードと同期
}