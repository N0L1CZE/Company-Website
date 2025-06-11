import type { NextApiRequest, NextApiResponse } from 'next'
import formidable, { File as FormidableFile, Files, Fields } from 'formidable'
import { v2 as cloudinary } from 'cloudinary'
import { prisma } from '@/lib/prisma'

// Disable built-in body parser
export const config = { api: { bodyParser: false } }

// Explicitní načtení z env
cloudinary.config({
  cloud_name:  process.env.CLOUDINARY_CLOUD_NAME,
  api_key:     process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET,
  secure:      true,
})

async function parseForm(req: NextApiRequest): Promise<{ fields: Fields; files: Files }> {
  const form = formidable({ keepExtensions: true })
  return new Promise((resolve, reject) =>
    form.parse(req as any, (err, fields, files) =>
      err ? reject(err) : resolve({ fields, files })
    )
  )
}

async function parseJsonBody(req: NextApiRequest) {
  let body = ''
  for await (const chunk of req) {
    body += chunk
  }
  return JSON.parse(body)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      try {
        const refs = await prisma.reference.findMany({
          orderBy: { createdAt: 'desc' },
          include: { persons: true },
        })
        return res.status(200).json(refs)
      } catch (err) {
        console.error('GET /api/references error:', err)
        return res.status(500).json({ error: 'Chyba při načítání referencí' })
      }
    }

    case 'POST': {
      const contentType = req.headers['content-type'] ?? ''
      try {
        // JSON mode
        if (contentType.includes('application/json')) {
          const { label, category, personIds, src } = await parseJsonBody(req)
          if (!label || !category || !src) {
            return res.status(400).json({ error: 'Chybí label, category nebo src' })
          }
          const created = await prisma.reference.create({
            data: {
              label,
              category,
              src,
              persons: { connect: (personIds as string[]).map(id => ({ id })) },
            },
            include: { persons: true },
          })
          return res.status(201).json(created)
        }

        // multipart/form-data mode
        if (contentType.includes('multipart/form-data')) {
          const { fields, files } = await parseForm(req)

          const label    = Array.isArray(fields.label)    ? fields.label[0]    : (fields.label ?? '')
          const category = Array.isArray(fields.category) ? fields.category[0] : (fields.category ?? '')
          let personIds  = fields.personIds ?? []
          if (!Array.isArray(personIds)) personIds = [personIds]
          personIds = personIds.map(String)

          const uploadField = files.file
          if (!label || !category || !uploadField) {
            return res.status(400).json({ error: 'Chybí label, category nebo file' })
          }

          const file: FormidableFile = Array.isArray(uploadField)
            ? uploadField[0]
            : uploadField

          // @ts-ignore
          const result = await cloudinary.uploader.upload(file.filepath, {
            folder: 'references',
          })
          const src = result.secure_url

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
        }

        return res.status(415).json({ error: 'Unsupported Content-Type' })
      } catch (err) {
        console.error('POST /api/references error:', err)
        return res.status(500).json({ error: 'Chyba při vytváření reference' })
      }
    }

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
