import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signedupInput } from "@samrudh3125/medium-blog";

export const userRouter=new Hono<{
    Bindings:{
        DATABASE_URL:string,
        JWT:string 
    }
}>();

userRouter.post('/signup',async (c) => {
    const body=await c.req.json();
    const {success}=signedupInput.safeParse(body);
    if(!success) {
      c.status(411)
      return c.json({message:'Invalid'},411)
    }

    const prisma = new PrismaClient({
      datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
    
    try{const user=await prisma.user.create({
      data:{
        email:body.email,
        password:body.password,
        name:body.name
      }
    })
  
    const token=await sign({id:user.id},c.env.JWT);
    return c.json({token:token})}
    catch(e){
        console.log(e);
        c.status(411)
        return c.json({message:'Invalid'},411)
    }
  })

  userRouter.post('/signin',async (c) => {
    const body=await c.req.json();
    const {success}=signedupInput.safeParse(body);
    if(!success) {
      c.status(411)
      return c.json({message:'Invalid'},411)
    }

    const prisma = new PrismaClient({
      datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
  
    try{const user=await prisma.user.findFirst({
      where:{
        email:body.email,
        password:body.password
      }
    })

    if(!user) return c.json({message:'User not found'},404)
  
    const token=await sign({id:user?.id},c.env.JWT);
    return c.json({token:token})}
    catch(e){

    }
  })
  