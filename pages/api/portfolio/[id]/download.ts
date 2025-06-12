// pages/api/portfolio/[id]/download.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import fetch from 'node-fetch'  // `npm install node-fetch`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const raw = req.query.id
  const id  = Array.isArray(raw) ? raw[0] : raw
  if (!id) return res.status(400).end('Chybí ID')

  // ze své DB dostaneš jen pdfUrl
  const item = await prisma.portfolioItem.findUnique({
    where: { id: Number(id) },
    select: { pdfUrl: true, title: true },
  })
  if (!item) return res.status(404).end('Nenalezeno')

  // stáhneš PDF z Cloudinary
  const upstream = await fetch(item.pdfUrl)
  if (!upstream.ok) return res.status(502).end('Chyba upstreamu')

  // nastavíš správné hlavičky, aby to šlo jako „download“
  res.setHeader('Content-Type', 'application/pdf')
  // tady si můžeš vybrat jakýkoliv název souboru
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${item.title.replace(/\s+/g,'_')}.pdf"`
  )

  // nakonec přepošleš binárku
  const buffer = Buffer.from(await upstream.arrayBuffer())
  return res.send(buffer)
}
