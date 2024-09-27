import type {Request, Response, NextFunction} from 'express'
import dotenv from 'dotenv'

dotenv.config()

const {ENV} = process.env;

function socketAllowOrigin(req: Request, res : Response, next : NextFunction){
    if(ENV && ENV == "dev"){
        res.setHeader("Access-Control-Allow-Origin", "*");
    }
    next();
}

export {
    socketAllowOrigin
}