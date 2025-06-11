import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

// Vestavěné parsování těla není potřeba pro DELETE
export const config = { api: { bodyParser: false } }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const raw = req.query.id
  const id  = Array.isArray(raw) ? raw[0] : raw
  if (!id) {
    return res.status(400).json({ error: 'Chybí ID' })
  }

  // --------------------------------------------------
  // DELETE /api/references/[id] — smaže záznam
  // --------------------------------------------------
  if (req.method === 'DELETE') {
    try {
      await prisma.reference.delete({ where: { id } })
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error('DELETE /api/references/[id] error:', err)
      return res.status(500).json({ error: 'Chyba při mazání reference' })
    }
  }

  // --------------------------------------------------
  // Jiné metody nejsou povoleny
  // --------------------------------------------------
  res.setHeader('Allow', ['DELETE'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
