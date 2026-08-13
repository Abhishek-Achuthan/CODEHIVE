import { Response } from 'express';

const isProduction =
  process.env.NODE_ENV?.toLowerCase() === 'production' ||
  process.env.NODE_ENV?.toLowerCase() === 'prod' ||
  Boolean(process.env.FRONTEND_URL?.startsWith('https://'));

const cookieDomain =
  isProduction && process.env.FRONTEND_URL?.includes('abhishekma.online')
    ? '.abhishekma.online'
    : undefined;

export function setCookie(res: Response, value: string, item: string) {
  res.cookie(item, value, {
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    domain: cookieDomain,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function setAccessibleCookie(res: Response, value: string, item: string) {
  res.cookie(item, value, {
    secure: isProduction,
    httpOnly: false,
    sameSite: isProduction ? 'none' : 'lax',
    domain: cookieDomain,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function removeCookie(res: Response, item: string) {
  res.clearCookie(item, {
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    domain: cookieDomain,
  });
}