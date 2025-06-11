// pages/api/portfolio/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

// protože čteme raw JSON, zakážeme vestavěný parser
export const config = { api: { bodyParser: false } }

// helper pro načtení JSON těla
async function readJson<T>(req: NextApiRequest): Promise<T> {
  let body = ''
  for await (const chunk of req) body += chunk
  return JSON.parse(body) as T
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const raw = req.query.id
  const id  = Array.isArray(raw) ? raw[0] : raw
  if (!id) return res.status(400).json({ error: 'Chybí ID' })

  /* -----------------------  PUT  ----------------------- */
  if (req.method === 'PUT') {
    try {
      const { title, personIds }: { title?: string; personIds?: string[] } = await readJson(req)

      if (!title || !Array.isArray(personIds) || personIds.length === 0) {
        return res.status(400).json({ error: 'Chybí title nebo personIds' })
      }

      const updated = await prisma.portfolioItem.update({
        where: { id: Number(id) },
        data: {
          title,
          persons: { set: personIds.map(pid => ({ id: pid })) }, // M:N update
        },
        include: { persons: true },
      })
      return res.status(200).json(updated)
    } catch (err) {
      console.error('PUT /api/portfolio/[id] error', err)
      return res.status(500).json({ error: 'Chyba při aktualizaci' })
    }
  }

  /* ---------------------  DELETE  ---------------------- */
  if (req.method === 'DELETE') {
    try {
      await prisma.portfolioItem.delete({ where: { id: Number(id) } })
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error('DELETE /api/portfolio/[id] error', err)
      return res.status(500).json({ error: 'Chyba při mazání' })
    }
  }

  res.setHeader('Allow', ['PUT', 'DELETE'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
