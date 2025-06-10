import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import { v2 as cloudinary } from 'cloudinary'
import { prisma } from '@/lib/prisma'

// Disable Next.js body parser so we can use formidable
export const config = { api: { bodyParser: false } }

// Let Cloudinary pick up process.env.CLOUDINARY_URL
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
  // GET all references
  if (req.method === 'GET') {
    try {
      const refs = await prisma.reference.findMany({
        orderBy: { createdAt: 'desc' },
        include: { persons: true },
      })
      return res.status(200).json(refs)
    } catch (e) {
      console.error('GET /api/references error', e)
      return res.status(500).json({ error: 'Chyba při načítání referencí' })
    }
  }

  // Create new reference
  if (req.method === 'POST') {
    try {
      const { fields, files } = await parseForm(req)

      const label    = Array.isArray(fields.label)    ? fields.label[0]    : (fields.label ?? '')
      const category = Array.isArray(fields.category) ? fields.category[0] : (fields.category ?? '')
      let personIds  = fields.personIds ?? []
      if (!Array.isArray(personIds)) personIds = [personIds]
      personIds = personIds.map(String)

      // Validate
      const upload = files.file
      const file   = Array.isArray(upload) ? upload[0] : upload
      if (!label || !category || !file) {
        return res.status(400).json({ error: 'Chybí label, category nebo file' })
      }

      // Upload to Cloudinary
      // @ts-ignore filepath is present on formidable File
      const result = await cloudinary.uploader.upload((file as any).filepath, {
        folder: 'references',
      })
      const src = result.secure_url

      // Save in DB
      const created = await prisma.reference.create({
        data: {
          label,
          category,
          src,
          persons: {
            connect: personIds.map(id => ({ id })),
          },
        },
        include: { persons: true },
      })
      return res.status(201).json(created)
    } catch (e) {
      console.error('POST /api/references error', e)
      return res.status(500).json({ error: 'Chyba při vytváření reference' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
