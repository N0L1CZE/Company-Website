// pages/api/portfolio/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const raw = req.query.id
  const id = Array.isArray(raw) ? raw[0] : raw
  if (!id) return res.status(400).json({ error: 'Chybí ID' })

  if (req.method === 'PUT') {
    try {
      const { title } = req.body as { title?: string }
      const updated = await prisma.portfolioItem.update({
        where: { id: Number(id) },
        data: { title: title! },
        include: { person: true },
      })
      return res.status(200).json(updated)
    } catch (e) {
      console.error('PUT /api/portfolio/[id] error', e)
      return res.status(500).json({ error: 'Chyba při aktualizaci' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.portfolioItem.delete({ where: { id: Number(id) } })
      return res.status(200).json({ ok: true })
    } catch (e) {
      console.error('DELETE /api/portfolio/[id] error', e)
      return res.status(500).json({ error: 'Chyba při mazání' })
    }
  }

  res.setHeader('Allow', ['PUT', 'DELETE'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
