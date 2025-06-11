import type { NextApiRequest, NextApiResponse } from 'next'
import formidable, { type Fields, type Files, type File as FormidableFile } from 'formidable'
import fs from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'

export const config = { api: { bodyParser: false } }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store')

  /* ---------------------------  GET  --------------------------- */
  if (req.method === 'GET') {
    try {
      const items = await prisma.portfolioItem.findMany({
        include: { persons: true },        // ⬅️ změna: persons (M:N)
        orderBy: { createdAt: 'desc' },
      })
      return res.status(200).json(items)
    } catch (e) {
      console.error('GET /api/portfolio error', e)
      return res.status(500).json({ error: 'Chyba při načítání položek' })
    }
  }

  /* ---------------------------  POST  --------------------------- */
  if (req.method === 'POST') {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.promises.mkdir(uploadDir, { recursive: true })

    const form = formidable({ uploadDir, keepExtensions: true, multiples: false })

    try {
      const { fields, files }: { fields: Fields; files: Files } = await new Promise((resolve, reject) =>
        form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })))
      )

      /* --------- vytažení a validace PDF --------- */
      const rawFile = files.pdf
      if (!rawFile) return res.status(400).json({ error: 'PDF soubor je povinný' })
      const file = Array.isArray(rawFile) ? rawFile[0] as FormidableFile : rawFile as FormidableFile
      const filePath = 'filepath' in file ? file.filepath : (file as any).path
      if (typeof filePath !== 'string') throw new Error('Nenalezen filepath uploadovaného souboru')
      const pdfUrl = `/uploads/${path.basename(filePath)}`

      /* --------- textová pole --------- */
      const title       = Array.isArray(fields.title)    ? fields.title[0]    : fields.title
      const rawIds      = fields.personIds ?? []                      // ⬅️ jméno pole v adminu
      if (!title || !rawIds) return res.status(400).json({ error: 'Chybí title nebo personIds' })

      const personIds = Array.isArray(rawIds) ? rawIds.map(String) : [String(rawIds)]

      /* --------- uložení do DB --------- */
      const newItem = await prisma.portfolioItem.create({
        data: {
          title,
          pdfUrl,
          persons: { connect: personIds.map(id => ({ id })) },   // ⬅️ M:N vazba
        },
        include: { persons: true },
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
