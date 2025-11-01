import { Response } from "express";

export function setCookie(res:Response,value:string,item:string) {
    res.cookie(item,value,{
        secure:true,
        httpOnly:true,
        sameSite:'strict',
        maxAge: 7 * 24 * 60 * 60
    });
}

export function removeCookie(res:Response, item:string) {
    res.clearCookie(item,{
        httpOnly:true,
        sameSite:'strict'
    })
}