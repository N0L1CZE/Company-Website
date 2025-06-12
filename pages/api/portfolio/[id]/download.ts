// pages/api/portfolio/[id]/download.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import fetch from 'node-fetch'      // npm i node-fetch@2

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1) Získat ID
  const raw = req.query.id
  const id  = Array.isArray(raw) ? raw[0] : raw
  if (!id) return res.status(400).end('Chybí ID')

  // 2) Načíst uložené pdfUrl + title z DB
  const item = await prisma.portfolioItem.findUnique({
    where: { id: Number(id) },
    select: { pdfUrl: true, title: true },
  })
  if (!item) return res.status(404).end('Nenalezeno')

  // 3) Stáhnout PDF z Cloudinary
  const upstream = await fetch(item.pdfUrl)
  if (!upstream.ok) {
    console.error('Upstream error', upstream.statusText)
    return res.status(502).end('Chyba při stahování z Cloudinary')
  }

  // 4) Nastavit hlavičky pro prohlížeč (inline zobrazit nebo attachment stáhnout)
  res.setHeader('Content-Type', 'application/pdf')
  // pokud chcete rovnou “Save as…”, použijte attachment; pro inline zobrazování dejte inline
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${item.title.replace(/\s+/g, '_')}.pdf"`
  )

  // 5) Přeposlat binární data
  const buffer = Buffer.from(await upstream.arrayBuffer())
  return res.status(200).send(buffer)
}
