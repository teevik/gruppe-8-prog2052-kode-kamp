import type {Request, Response, NextFunction} from 'express'

function socketAllowOrigin(req: Request, res : Response, next : NextFunction){
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
}

export {
    socketAllowOrigin
}