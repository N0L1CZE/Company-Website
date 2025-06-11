import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import { v2 as cloudinary } from 'cloudinary'
import { prisma } from '@/lib/prisma'

export const config = { api: { bodyParser: false } }
cloudinary.config({ secure: true })

async function parseForm(req: NextApiRequest) {
  const form = formidable({ keepExtensions: true })
  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) =>
      form.parse(req, (err, fields, files) =>
        err ? reject(err) : resolve({ fields, files })
      )
  )
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  /* ---------- GET ---------- */
  if (req.method === 'GET') {
    const items = await prisma.portfolioItem.findMany({
      include: { persons: true },
      orderBy: { createdAt: 'desc' },
    })
    return res.status(200).json(items)
  }

  /* ---------- POST ---------- */
  if (req.method === 'POST') {
    try {
      const { fields, files } = await parseForm(req)

      // pole IDs
      const rawIds     = fields.personIds ?? []
      const personIds  = Array.isArray(rawIds) ? rawIds.map(String) : [String(rawIds)]

      const titleField = Array.isArray(fields.title) ? fields.title[0] : fields.title
      const uploadFile = files.pdf && (Array.isArray(files.pdf) ? files.pdf[0] : files.pdf)

      if (!titleField || !uploadFile) {
        return res.status(400).json({ error: 'Chybí title nebo PDF' })
      }

      // ---- nahraj PDF na Cloudinary jako RAW ----
      // @ts-ignore filepath existuje
      const up = await cloudinary.uploader.upload(uploadFile.filepath, {
        folder: 'portfolio',
        resource_type: 'raw',   // důležité pro PDF
        format: 'pdf',
      })
      const pdfUrl = up.secure_url

      // ---- ulož do DB ----
      const created = await prisma.portfolioItem.create({
        data: {
          title: titleField,
          pdfUrl,
          persons: { connect: personIds.map(id => ({ id })) },
        },
        include: { persons: true },
      })

      return res.status(201).json(created)
    } catch (err) {
      console.error('POST /api/portfolio error:', err)
      return res.status(500).json({ error: 'Chyba při ukládání PDF' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end('Method Not Allowed')
}
