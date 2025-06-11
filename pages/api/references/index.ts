// pages/api/references/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import { v2 as cloudinary } from 'cloudinary'
import { prisma } from '@/lib/prisma'

// Disable Next.js built-in body parser so formidable can handle multipart form data
export const config = { api: { bodyParser: false } }

// Let Cloudinary read CLOUDINARY_URL from env
cloudinary.config({ secure: true })

// Helper to parse multipart form data
async function parseForm(req: NextApiRequest) {
  const form = formidable({ keepExtensions: true })
  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) =>
      form.parse(req, (err, fields, files) =>
        err ? reject(err) : resolve({ fields, files })
      )
  )
}

// Helper to parse JSON body when bodyParser is disabled
async function parseJsonBody(req: NextApiRequest) {
  let body = ''
  for await (const chunk of req) {
    body += chunk
  }
  try {
    return JSON.parse(body)
  } catch {
    throw new Error('Invalid JSON')
  }
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
    } catch (err) {
      console.error('GET /api/references error:', err)
      return res.status(500).json({ error: 'Chyba při načítání referencí' })
    }
  }

  // POST: support two modes: JSON payload or file upload
  if (req.method === 'POST') {
    const contentType = req.headers['content-type'] || ''

    // JSON mode: client already uploaded to Cloudinary and sends URL
    if (contentType.includes('application/json')) {
      try {
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
      } catch (err) {
        console.error('POST JSON /api/references error:', err)
        return res.status(400).json({ error: 'Neplatné JSON tělo' })
      }
    }

    // multipart/form-data mode: upload file to Cloudinary
    if (contentType.includes('multipart/form-data')) {
      try {
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

        // Upload to Cloudinary
        // @ts-ignore filepath exists on formidable.File
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
      } catch (err) {
        console.error('POST multipart /api/references error:', err)
        return res.status(500).json({ error: 'Chyba při vytváření reference' })
      }
    }

    // unsupported content type
    return res.status(415).json({ error: 'Unsupported Content-Type' })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
