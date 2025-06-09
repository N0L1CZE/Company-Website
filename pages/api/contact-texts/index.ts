import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const items = await prisma.contactText.findMany({ orderBy: { key: 'asc' } })
    return res.status(200).json(items)
  }
  if (req.method === 'POST') {
    const { key, content } = req.body as { key: string; content: string }
    if (!key || !content) return res.status(400).json({ error: 'Chybí key nebo content' })
    const created = await prisma.contactText.create({ data: { key, content } })
    return res.status(201).json(created)
  }
  res.setHeader('Allow', ['GET','POST'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
