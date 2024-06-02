import z from "zod";

export const signedupInput=z.object({
    username:z.string().email(),
    password:z.string().min(6),
    name:z.string().optional()
});

export const signedinInput=z.object({
    username:z.string().email(),
    password:z.string().min(6)
});

export const blogInput=z.object({
    title:z.string(),
    content:z.string()
});

export const updateBlogInput=z.object({
    id:z.number(),
    title:z.string(),
    content:z.string()
});

export type UpdateBlogInput=z.infer<typeof updateBlogInput>;
export type BlogInput=z.infer<typeof blogInput>;
export type SignedinInput=z.infer<typeof signedinInput>;
export type SignedupInput=z.infer<typeof signedupInput>;