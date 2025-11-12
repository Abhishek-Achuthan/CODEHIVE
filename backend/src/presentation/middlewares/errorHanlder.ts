import { NextFunction, Request, Response } from 'express';
import { BaseError } from '../../core/errors/BaseError';

 // eslint-disable-next-line 
export function errorHandler(err: Error,req:Request,res:Response,next:NextFunction) {
    if(err instanceof BaseError) {
        console.error('Custom Error:', err.message);

        return res.status(err._statusCode).json({
            success:false,
            message:err.message
        })
    }
        
    return res.status(500).json({
        success:false,
        message:'Internal Server Error'
    })
}