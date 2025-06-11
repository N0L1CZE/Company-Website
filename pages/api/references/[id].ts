// pages/api/references/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import { v2 as cloudinary } from 'cloudinary'
import { prisma } from '@/lib/prisma'

// Disable Next.js built-in body parser
export const config = { api: { bodyParser: false } }

// Cloudinary secure config
cloudinary.config({ secure: true })

async function parseForm(req: NextApiRequest) {
  const form = formidable({ keepExtensions: true })
  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) =>
      form.parse(req as any, (err, fields, files) =>
        err ? reject(err) : resolve({ fields, files })
      )
  )
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const raw = req.query.id
  const id  = Array.isArray(raw) ? raw[0] : raw
  if (!id) {
    return res.status(400).json({ error: 'Chybí ID' })
  }

  switch (req.method) {
    // GET one by id
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

    // PUT update
    case 'PUT': {
      try {
        const { fields, files } = await parseForm(req)
        const label    = Array.isArray(fields.label)    ? fields.label[0]    : (fields.label ?? '')
        const category = Array.isArray(fields.category) ? fields.category[0] : (fields.category ?? '')
        let personIds  = fields.personIds ?? []
        if (!Array.isArray(personIds)) personIds = [personIds]
        personIds = personIds.map(String)

        // načti starou referenci pro případné smazání obrázku
        const old = await prisma.reference.findUnique({ where: { id } })
        let src = old?.src

        const upload = files.file
        if (upload) {
          const file = Array.isArray(upload) ? upload[0] : upload
          // smaž starý obrázek
          if (old?.src) {
            const match = old.src.match(/\/references\/([^.?/]+)/)
            if (match) {
              const oldPublicId = `references/${match[1]}`
              await cloudinary.uploader.destroy(oldPublicId).catch(err => {
                console.warn('Cloudinary destroy failed:', err)
              })
            }
          }
          // nahraj nový
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

    // DELETE
    case 'DELETE': {
      try {
        const old = await prisma.reference.findUnique({ where: { id } })
        if (old?.src) {
          const match = old.src.match(/\/references\/([^.?/]+)/)
          if (match) {
            const publicId = `references/${match[1]}`
            await cloudinary.uploader.destroy(publicId).catch(err => {
              console.warn('Cloudinary destroy failed:', err)
            })
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
