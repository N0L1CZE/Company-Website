import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST'])
      return res.status(405).json({ error: 'Method Not Allowed' })
    }

    const { email, password } = req.body as { email?: string; password?: string }
    if (!email || !password) {
      return res.status(400).json({ error: 'Vyplň e-mail i heslo' })
    }

    // 1) fetch user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Neplatné přihlašovací údaje' })
    }

    // 2) check password
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return res.status(401).json({ error: 'Neplatné přihlašovací údaje' })
    }

    // 3) sign JWT
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('🔑 Missing JWT_SECRET')
    }

    const token = sign({ userId: user.id, email: user.email }, secret, {
      expiresIn: '2h',
    })

    // 4) set cookie (no Secure during preview)
    const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : ''
    res.setHeader(
      'Set-Cookie',
      `auth_token=${token}; Path=/; HttpOnly; SameSite=Lax${secureFlag}`
    )

    return res.status(200).json({ ok: true })
  } catch (e: any) {
    console.error('💥 login error:', e)
    return res.status(500).json({ error: e.message || 'Internal Server Error' })
  }
}
