import { useState } from "react"
import { Input } from "./Input"
import { SignedupInput } from "@samrudh3125/medium-blog"

export const Auth=({type}:{type:"signup"|"signin"})=>{
    const [postInputs,setPostInputs]=useState<SignedupInput>({
        name:"",
        username:"",
        password:""
    })
    return (
        <div className="h-screen flex justify-center">
            <div className="flex justify-center flex-col">
                <div>
                    <div className="text-3xl font-extrabold">
                        Create an account
                    </div>
                </div>
                <div className="text-slate-400">
                    Already have an account? <a href="/signin" className="text-blue-500 underline">Login</a>
                </div>
                <Input label="Name" placeholder="Samrudh Shetty" onChange={(e)=>{setPostInputs({
                    ...postInputs,
                    name:e.target.value
                })}}/>
                <Input label="Username" placeholder="samrudh3125@gmail.com" onChange={(e)=>{setPostInputs({
                    ...postInputs,
                    username:e.target.value
                })}}/>
                <Input label="Password" placeholder="12345678" onChange={(e)=>{setPostInputs({
                    ...postInputs,
                    password:e.target.value
                })}}/>
            </div>
        </div>
    )
}