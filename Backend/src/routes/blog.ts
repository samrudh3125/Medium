import { PrismaClient } from "@prisma/client/extension";
import { withAccelerate } from "@prisma/extension-accelerate";
import { blogInput, updateBlogInput } from "@samrudh3125/medium-blog";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter=new Hono<{
    Bindings:{
        DATABASE_URL:string,
        JWT:string 
    },
    Variables:{
        userId:number
    }
}>();

blogRouter.use("/*",async(c,next)=>{
     const token=c.req.header('Authorization')?.split(' ')[1]||"";
     try {
        const response=await verify(token,c.env.JWT);
     if(response){
        c.set("userId",response.id);
        await next();
     } else{
        c.status(403);
        c.json({message:'Unauthorized'});
     }
     } catch (e) {
        console.log(e);
        c.status(403);
        return c.json({message:'Unauthorized'});
     }
})

blogRouter.post('/',async(c) => {
    const userId=c.get('userId');
    const body=await c.req.json();
    const {success}=blogInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({message:'Invalid'});
    }

    const prisma =new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try{
        const blog=await prisma.blog.create({
            data:{
                title:body.title,
                content:body.content,
                authorId:Number(userId)
            }
        })
        return c.json({id:blog.id});
    }catch(e){
        console.log(e);
        c.status(411);
        return c.json({message:'Invalid'});
    }
})
  
blogRouter.put('/',async(c) => {
    const body=await c.req.json();
    const {success}=updateBlogInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({message:'Invalid'});
    }
    
    const prisma =new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const blog=await prisma.blog.update({
            where:{
                id:body.id
            },
            data:{
                title:body.title,
                content:body.content
            }
        });
        
        return c.json({id:blog.id});
    } catch (e) {
        console.log(e);
        c.status(411);
        return c.json({message:'Error while fetching'});
    }
})

blogRouter.get('/bulk',async(c) => {
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const blogs=await prisma.blog.findMany();
        return c.json(blogs);
    } catch (e) {
        console.log(e);
        c.status(411);
        return c.json({message:'Invalid'});
    }
})
  
blogRouter.get('/:id',async(c) => {
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
    
    try {
        const blog=await prisma.blog.findFirst({
            where:{
                id:Number(c.req.param("id"))
            }
        })
    
        return c.json(blog);
    } catch (e) {
        console.log(e);
        c.status(411);
        return c.json({message:'Invalid'});
    }
})