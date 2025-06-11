// pages/api/references/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import { v2 as cloudinary } from 'cloudinary'
import { prisma } from '@/lib/prisma'

// Disable Next.js built-in body parser
export const config = { api: { bodyParser: false } }

// Cloudinary secure config
cloudinary.config({ secure: true })

// Parsování multipart/form-data
async function parseForm(req: NextApiRequest) {
  const form = formidable({ keepExtensions: true })
  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) =>
      form.parse(req as any, (err, fields, files) =>
        err ? reject(err) : resolve({ fields, files })
      )
  )
}

// Parsování JSON, když je bodyParser vypnutý
async function parseJsonBody(req: NextApiRequest) {
  let body = ''
  for await (const chunk of req) {
    body += chunk
  }
  return JSON.parse(body)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    // GET all
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

    // POST new reference
    case 'POST': {
      const contentType = req.headers['content-type'] || ''
      try {
        // JSON mode: klient už má src (Cloudinary) a posílá ho
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

        // multipart/form-data mode: nahrát soubor na Cloudinary
        if (contentType.includes('multipart/form-data')) {
          const { fields, files } = await parseForm(req)
          const label    = Array.isArray(fields.label)    ? fields.label[0]    : (fields.label ?? '')
          const category = Array.isArray(fields.category) ? fields.category[0] : (fields.category ?? '')
          let personIds  = fields.personIds ?? []
          if (!Array.isArray(personIds)) personIds = [personIds]
          personIds = personIds.map(String)

          const upload = files.file
          const file   = Array.isArray(upload) ? upload[0] : upload
          if (!label || !category || !file) {
            return res.status(400).json({ error: 'Chybí label, category nebo file' })
          }

          // @ts-ignore filepath exists
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

        // nepodporovaný typ
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
