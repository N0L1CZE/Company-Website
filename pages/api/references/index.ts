import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'

export const config = { api: { bodyParser: false } }

async function parseForm(req: NextApiRequest) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  await fs.promises.mkdir(uploadDir, { recursive: true })

  const form = formidable({ uploadDir, keepExtensions: true })
  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) =>
      form.parse(req, (err, fields, files) => err ? reject(err) : resolve({ fields, files }))
  )
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1) GET all
  if (req.method === 'GET') {
    const refs = await prisma.reference.findMany({
      orderBy: { createdAt: 'desc' },
      include: { persons: true },
    })
    return res.status(200).json(refs)
  }

  // 2) POST new
  if (req.method === 'POST') {
    try {
      const { fields, files } = await parseForm(req)

      // Label + category
      const label    = Array.isArray(fields.label)    ? fields.label[0]    : fields.label ?? ''
      const category = Array.isArray(fields.category) ? fields.category[0] : fields.category ?? ''

      // Persons
      let personIds = fields.personIds ?? []
      if (!Array.isArray(personIds)) personIds = [personIds]
      personIds = personIds.map(String)

      // File upload
      const upload = files.file
      const file   = Array.isArray(upload) ? upload[0] : upload
      if (!label || !category || !file) {
        return res.status(400).json({ error: 'Chybí label, category nebo file' })
      }
      const filename = path.basename((file as any).filepath)
      const src      = `/uploads/${filename}`

      // Create in DB
      const created = await prisma.reference.create({
        data: {
          label,
          category,
          src,
          persons: { connect: personIds.map(id => ({ id })) },
        },
        include: { persons: true },
      })
      return res.status(201).json(created)
    } catch (e) {
      console.error('POST /api/references error', e)
      return res.status(500).json({ error: 'Nepodařilo se vytvořit reference' })
    }
  }

  res.setHeader('Allow', ['GET','POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
