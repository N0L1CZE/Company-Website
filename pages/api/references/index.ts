import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const refs = await prisma.reference.findMany({
        orderBy: { createdAt: 'desc' },
        include: { persons: true },
      })
      return res.status(200).json(refs)
    } catch (err) {
      console.error('GET /api/references error:', err)
      return res.status(500).json({ error: 'Chyba při načítání referencí' })
    }
  }

  res.setHeader('Allow', ['GET'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
