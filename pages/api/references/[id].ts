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
  const raw = req.query.id
  const id  = Array.isArray(raw) ? raw[0] : raw
  if (!id) return res.status(400).json({ error: 'Chybí ID' })

  // PUT /api/references/[id]
  if (req.method === 'PUT') {
    try {
      const { fields, files } = await parseForm(req)
      const label    = Array.isArray(fields.label)    ? fields.label[0]    : fields.label ?? ''
      const category = Array.isArray(fields.category) ? fields.category[0] : fields.category ?? ''

      let personIds = fields.personIds ?? []
      if (!Array.isArray(personIds)) personIds = [personIds]
      personIds = personIds.map(String)

      // Fetch old record to delete old file if replaced
      const old = await prisma.reference.findUnique({ where: { id } })
      let src = old?.src

      // If new file uploaded, remove old + set new src
      const upload = files.file
      if (upload) {
        const file = Array.isArray(upload) ? upload[0] : upload
        if (old?.src) {
          await fs.promises.unlink(path.join(process.cwd(), 'public', old.src.replace(/^\//, ''))).catch(() => {})
        }
        const filename = path.basename((file as any).filepath)
        src = `/uploads/${filename}`
      }

      // Update DB
      const updated = await prisma.reference.update({
        where: { id },
        data: {
          label,
          category,
          ...(src ? { src } : {}),
          persons: { set: personIds.map(pid => ({ id: pid })) },
        },
        include: { persons: true },
      })
      return res.status(200).json(updated)
    } catch (e) {
      console.error('PUT /api/references/[id] error', e)
      return res.status(500).json({ error: 'Nepodařilo se upravit reference' })
    }
  }

  // DELETE /api/references/[id]
  if (req.method === 'DELETE') {
    try {
      const old = await prisma.reference.findUnique({ where: { id } })
      if (old) {
        // remove file
        await fs.promises.unlink(path.join(process.cwd(), 'public', old.src.replace(/^\//, ''))).catch(() => {})
        await prisma.reference.delete({ where: { id } })
      }
      return res.status(200).json({ ok: true })
    } catch (e) {
      console.error('DELETE /api/references/[id] error', e)
      return res.status(500).json({ error: 'Nepodařilo se smazat reference' })
    }
  }

  res.setHeader('Allow', ['PUT','DELETE'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
