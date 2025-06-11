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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const raw = req.query.id
  const id  = Array.isArray(raw) ? raw[0] : raw
  if (!id) return res.status(400).json({ error: 'Chybí ID' })

  switch (req.method) {
    case 'GET': {
      const reference = await prisma.reference.findUnique({
        where: { id },
        include: { persons: true },
      })
      if (!reference) {
        return res.status(404).json({ error: 'Reference nenalezena' })
      }
      return res.status(200).json(reference)
    }

    case 'PUT': {
      try {
        const { fields, files } = await parseForm(req)

        const label    = Array.isArray(fields.label)    ? fields.label[0]    : (fields.label ?? '')
        const category = Array.isArray(fields.category) ? fields.category[0] : (fields.category ?? '')
        let personIds  = fields.personIds ?? []
        if (!Array.isArray(personIds)) personIds = [personIds]
        personIds = personIds.map(String)

        const old = await prisma.reference.findUnique({ where: { id } })
        let src = old?.src

        const uploadField = files.file
        if (uploadField) {
          const file: FormidableFile = Array.isArray(uploadField)
            ? uploadField[0]
            : uploadField

          if (old?.src) {
            const m = old.src.match(/\/references\/([^.?/]+)/)
            if (m) {
              await cloudinary.uploader.destroy(`references/${m[1]}`)
                .catch(err => console.warn('Cloudinary destroy failed:', err))
            }
          }

          // @ts-ignore
          const up = await cloudinary.uploader.upload(file.filepath, {
            folder: 'references',
          })
          src = up.secure_url
        }

        const updated = await prisma.reference.update({
          where: { id },
          data: {
            label,
            category,
            src,
            persons: { set: personIds.map(pid => ({ id: pid })) },
          },
          include: { persons: true },
        })
        return res.status(200).json(updated)
      } catch (e) {
        console.error('PUT /api/references/[id] error', e)
        return res.status(500).json({ error: 'Nepodařilo se upravit referenci' })
      }
    }

    case 'DELETE': {
      try {
        const old = await prisma.reference.findUnique({ where: { id } })
        if (old?.src) {
          const m = old.src.match(/\/references\/([^.?/]+)/)
          if (m) {
            await cloudinary.uploader.destroy(`references/${m[1]}`)
              .catch(err => console.warn('Cloudinary destroy failed:', err))
          }
        }
        await prisma.reference.delete({ where: { id } })
        return res.status(200).json({ ok: true })
      } catch (e) {
        console.error('DELETE /api/references/[id] error', e)
        return res.status(500).json({ error: 'Nepodařilo se smazat referenci' })
      }
    }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
