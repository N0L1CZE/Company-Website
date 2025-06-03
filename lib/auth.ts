import { NextRequest, NextResponse } from 'next/server'
import { sign, verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export function createToken(payload: object) {
  return sign(payload, JWT_SECRET, { expiresIn: '2h' })
}

export function verifyToken(token: string) {
  return verify(token, JWT_SECRET)
}

export function getTokenFromReq(req: NextRequest) {
  return req.cookies.get('auth_token')?.value
}

export function setTokenCookie(res: NextResponse, token: string) {
  res.cookies.set({
    name: 'auth_token',
    value: token,
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 2,
  })
}