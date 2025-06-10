import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // 1) Jen POST povoleno
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST'])
      return res.status(405).json({ error: 'Method Not Allowed' })
    }

    // 2) Načteme tělo
    const { email, password } = req.body as {
      email?: string
      password?: string
    }

    if (!email || !password) {
      return res.status(400).json({ error: 'Vyplň e-mail i heslo' })
    }

    // 3) Najdeme uživatele
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Neplatné přihlašovací údaje' })
    }

    // 4) Ověříme heslo
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return res.status(401).json({ error: 'Neplatné přihlašovací údaje' })
    }

    // 5) Vygenerujeme JWT
    const token = sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '2h' }
    )

    // 6) Nastavíme cookie
    res.setHeader(
      'Set-Cookie',
      `auth_token=${token}; Path=/; HttpOnly; SameSite=Lax; Secure`
    )

    // 7) Vrátíme úspěch
    return res.status(200).json({ ok: true })
  } catch (error) {
    // 8) Ošetření neočekávané chyby – vždy validní JSON
    console.error('💥 /api/auth/login error:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
