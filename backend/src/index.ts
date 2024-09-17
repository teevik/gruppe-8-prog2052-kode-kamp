import express, { Express, Request, Response } from "express";
import dotenv from 'dotenv';

dotenv.config();

const app : Express = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req : Request,res : Response)=>{
    res.send("hello world");
})

app.listen(PORT, ()=>{
    console.log(`Server is listening on port: ${PORT}`);
})