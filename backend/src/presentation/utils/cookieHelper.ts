import { Response } from "express";

export function setCookie(res:Response,value:string,item:string) {
    res.cookie(item,value,{
        secure:false,
        httpOnly:true,
        sameSite:'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}

export function setAccessibleCookie(res:Response,value:string,item:string) {
    res.cookie(item,value,{
        secure:false,
        httpOnly:false, 
        sameSite:'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}

export function removeCookie(res:Response, item:string) {
    res.clearCookie(item,{
        secure:false,
        httpOnly:true,
        sameSite:'strict'
    })
}