// pages/api/portfolio/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import type { Fields, Files, File as FormidableFile } from 'formidable'
import fs from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'

export const config = { api: { bodyParser: false } }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'GET') {
    try {
      const items = await prisma.portfolioItem.findMany({
        include: { person: true },
        orderBy: { createdAt: 'desc' },
      })
      return res.status(200).json(items)
    } catch (e) {
      console.error('GET /api/portfolio error', e)
      return res.status(500).json({ error: 'Chyba při načítání položek' })
    }
  }

  if (req.method === 'POST') {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.promises.mkdir(uploadDir, { recursive: true })

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      multiples: false,
    })

    try {
      const { fields, files }: { fields: Fields; files: Files } =
        await new Promise((resolve, reject) => {
          form.parse(req, (err, fields, files) => {
            if (err) reject(err)
            else resolve({ fields, files })
          })
        })

      // Získáme soubor a ověříme jeho existenci
      const rawFile = files.pdf
      if (!rawFile) {
        return res.status(400).json({ error: 'PDF soubor je povinný' })
      }
      const file = Array.isArray(rawFile)
        ? (rawFile[0] as FormidableFile)
        : (rawFile as FormidableFile)

      // Použijeme `filepath` (novější formidable) nebo fallback na `.path`
      const filePath = typeof file.filepath === 'string'
        ? file.filepath
        : (file as any).path
      if (!filePath || typeof filePath !== 'string') {
        throw new Error('Nenalezen filepath uploadovaného souboru')
      }

      const fileName = path.basename(filePath)
      const pdfUrl   = `/uploads/${fileName}`

      // Získáme a rozbalíme pole/string u polí formuláře
      const rawTitle    = fields.title
      const rawPersonId = fields.personId
      if (!rawTitle || !rawPersonId) {
        return res.status(400).json({ error: 'Chybí title nebo personId' })
      }
      const title    = Array.isArray(rawTitle)    ? rawTitle[0]    : rawTitle
      const personId = Array.isArray(rawPersonId) ? rawPersonId[0] : rawPersonId

      const newItem = await prisma.portfolioItem.create({
        data: { title, pdfUrl, personId },
        include: { person: true },
      })
      return res.status(201).json(newItem)
    } catch (e) {
      console.error('POST /api/portfolio error', e)
      return res.status(500).json({ error: 'Chyba při uploadu nebo ukládání' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
