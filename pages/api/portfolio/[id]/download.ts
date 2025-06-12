// pages/api/portfolio/[id]/download.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import cloudinary from '@/lib/cloudinary'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const raw = req.query.id
  const id  = Array.isArray(raw) ? raw[0] : raw
  if (!id) return res.status(400).end('Chybí ID')

  // Z DB si načteme uloženou pdfUrl a title
  const item = await prisma.portfolioItem.findUnique({
    where: { id: Number(id) },
    select: { pdfUrl: true, title: true },
  })
  if (!item) return res.status(404).end('Nenalezeno')

  // Vygenerujeme podepsanou URL s hlavičkami pro attachment
  const downloadUrl = cloudinary.url(item.pdfUrl, {
    resource_type:  'raw',
    format:         'pdf',
    flags:          'attachment',
    attachment:     `${item.title.replace(/\s+/g, '_')}.pdf`,
    sign_url:       true,
    expire_seconds: 3600,
  })

  // Přesměrujeme uživatele na ten odkaz — prohlížeč nabídne "Save as..."
  return res.redirect(downloadUrl)
}
