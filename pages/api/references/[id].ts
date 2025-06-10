import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'
import { prisma } from '@/lib/prisma'

// Disable Next.js body parser
export const config = { api: { bodyParser: false } }

// Cloudinary picks up CLOUDINARY_URL
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
  const raw = req.query.id
  const id  = Array.isArray(raw) ? raw[0] : raw
  if (!id) return res.status(400).json({ error: 'Chybí ID' })

  // Update existing reference
  if (req.method === 'PUT') {
    try {
      const { fields, files } = await parseForm(req)

      const label    = Array.isArray(fields.label)    ? fields.label[0]    : (fields.label ?? '')
      const category = Array.isArray(fields.category) ? fields.category[0] : (fields.category ?? '')
      let personIds  = fields.personIds ?? []
      if (!Array.isArray(personIds)) personIds = [personIds]
      personIds = personIds.map(String)

      // Fetch old to remove old image if replaced
      const old = await prisma.reference.findUnique({ where: { id } })
      let src = old?.src

      const upload = files.file
      if (upload) {
        const file = Array.isArray(upload) ? upload[0] : upload
        // delete old file from Cloudinary? (optional)
        // upload new one
        // @ts-ignore
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: 'references',
        })
        src = result.secure_url
      }

      const updated = await prisma.reference.update({
        where: { id },
        data: {
          label,
          category,
          src,
          persons: {
            set: personIds.map(pid => ({ id: pid })),
          },
        },
        include: { persons: true },
      })
      return res.status(200).json(updated)
    } catch (e) {
      console.error('PUT /api/references/[id] error', e)
      return res.status(500).json({ error: 'Nepodařilo se upravit reference' })
    }
  }

  // Delete reference
  if (req.method === 'DELETE') {
    try {
      const old = await prisma.reference.findUnique({ where: { id } })
      if (old) {
        // Optionally destroy old image from Cloudinary
        // await cloudinary.uploader.destroy( public_id from URL )
        await prisma.reference.delete({ where: { id } })
      }
      return res.status(200).json({ ok: true })
    } catch (e) {
      console.error('DELETE /api/references/[id] error', e)
      return res.status(500).json({ error: 'Nepodařilo se smazat reference' })
    }
  }

  res.setHeader('Allow', ['PUT', 'DELETE'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
