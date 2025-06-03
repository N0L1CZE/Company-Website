import type { NextApiRequest, NextApiResponse } from 'next'
import formidable, { File as FormidableFile } from 'formidable'
import fs from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'

export const config = { api: { bodyParser: false } }

function parseForm(req: NextApiRequest) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  fs.mkdirSync(uploadDir, { recursive: true })

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
  })

  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) =>
      form.parse(req, (err, fields, files) =>
        err ? reject(err) : resolve({ fields, files })
      )
  )
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const refs = await prisma.reference.findMany({ orderBy: { createdAt: 'desc' } })
    return res.status(200).json(refs)
  }

  if (req.method === 'POST') {
    try {
      const { fields, files } = await parseForm(req)

      const label = Array.isArray(fields.label) ? fields.label[0] : fields.label ?? ''
      const category = Array.isArray(fields.category)
        ? fields.category[0]
        : fields.category ?? ''
      const uploaded = files.file as FormidableFile | FormidableFile[] | undefined
      const file = Array.isArray(uploaded) ? uploaded[0] : uploaded

      if (!label || !category || !file) {
        return res.status(400).json({ error: 'Chybí název, kategorie nebo soubor' })
      }

      const filename = path.basename(file.filepath)
      const src = `/uploads/${filename}`

      const created = await prisma.reference.create({
        data: { label, category, src },
      })
      return res.status(201).json(created)
    } catch (e) {
      console.error(e)
      return res.status(500).json({ error: 'Nepodařilo se vytvořit záznam' })
    }
  }

  res.setHeader('Allow', ['GET','POST'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
