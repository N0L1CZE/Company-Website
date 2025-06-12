// pages/api/portfolio/[id]/download.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const raw = req.query.id
  const id  = Array.isArray(raw) ? raw[0] : raw
  if (!id) return res.status(400).end('Chybí ID')

  // vybere jen pdfUrl, to ti při uložení vždycky vrací cloudinary.uploader.upload().secure_url
  const item = await prisma.portfolioItem.findUnique({
    where: { id: Number(id) },
    select: { pdfUrl: true },
  })
  if (!item) return res.status(404).end('Nenalezeno')

  // přesměrujeme přímo na tu URL
  return res.redirect(item.pdfUrl)
}
