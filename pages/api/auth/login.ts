import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { email, password } = req.body as {
    email?: string
    password?: string
  }

  if (!email || !password) {
    return res.status(400).json({ error: 'Vyplň e-mail i heslo' })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return res.status(401).json({ error: 'Neplatné přihlašovací údaje' })
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return res.status(401).json({ error: 'Neplatné přihlašovací údaje' })
  }

  const token = sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '2h' }
  )

  res.setHeader('Set-Cookie', `auth_token=${token}; Path=/; HttpOnly; SameSite=Lax; Secure`)

  return res.status(200).json({ ok: true })
}