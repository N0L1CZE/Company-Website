import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string }

  if (req.method === 'PUT') {
    const { content } = req.body as { content: string }
    if (content == null) return res.status(400).json({ error: 'Chybí content' })
    const updated = await prisma.contactText.update({
      where: { id },
      data: { content },
    })
    return res.status(200).json(updated)
  }

  if (req.method === 'DELETE') {
    await prisma.contactText.delete({ where: { id } })
    return res.status(204).end()
  }

  if (req.method === 'GET') {
    const item = await prisma.contactText.findUnique({ where: { id } })
    return item ? res.status(200).json(item) : res.status(404).end()
  }

  res.setHeader('Allow', ['GET','PUT','DELETE'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
