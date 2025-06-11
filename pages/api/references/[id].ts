import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const raw = req.query.id
  const id  = Array.isArray(raw) ? raw[0] : raw
  if (!id) return res.status(400).json({ error: 'Chybí ID' })

  if (req.method === 'DELETE') {
    console.log('🔔 DELETE /api/references/' + id)
    try {
      // Pokusíme se smazat z DB
      const deleted = await prisma.reference.delete({ where: { id } })
      console.log('✅ Deleted reference:', deleted.id)
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error('❌ DELETE /api/references/[id] error:', err)
      return res.status(500).json({ error: 'Nepodařilo se smazat reference' })
    }
  }

  res.setHeader('Allow', ['DELETE'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
