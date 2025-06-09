// pages/api/references/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'

export const config = { api: { bodyParser: false } }

function parseForm(req: NextApiRequest) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  fs.mkdirSync(uploadDir, { recursive: true })

  const form = formidable({ uploadDir, keepExtensions: true })
  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        else resolve({ fields, files })
      })
    }
  )
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string }

  if (req.method === 'PUT') {
    try {
      const { fields, files } = await parseForm(req)
      const label = Array.isArray(fields.label) ? fields.label[0] : fields.label ?? ''
      const category = Array.isArray(fields.category) ? fields.category[0] : fields.category ?? ''

      let personIds = fields.personIds ?? []
      if (!Array.isArray(personIds)) personIds = [personIds]
      personIds = personIds.map((v) => String(v))

      const upload = files.file ? (Array.isArray(files.file) ? files.file[0] : files.file) : null

      const old = await prisma.reference.findUnique({ where: { id }, include: { persons: true } })
      if (!old) return res.status(404).json({ error: 'Reference nenalezena' })

      let src = old.src
      if (upload) {
        await fs.promises.unlink(path.join(process.cwd(), 'public', old.src.replace(/^\//, ''))).catch(() => {})
        const filename = path.basename((upload as any).filepath)
        src = `/uploads/${filename}`
      }

      const updated = await prisma.reference.update({
        where: { id },
        data: {
          label,
          category,
          src,
          persons: { set: personIds.map((pid) => ({ id: pid })) },
        },
        include: { persons: true },
      })
      return res.status(200).json(updated)
    } catch (e) {
      console.error('PUT error:', e)
      return res.status(500).json({ error: 'Nepodařilo se upravit reference' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const old = await prisma.reference.findUnique({ where: { id } })
      if (old) {
        await fs.promises.unlink(path.join(process.cwd(), 'public', old.src.replace(/^\//, ''))).catch(() => {})
        await prisma.reference.delete({ where: { id } })
      }
      return res.status(200).json({ ok: true })
    } catch (e) {
      console.error('DELETE error:', e)
      return res.status(500).json({ error: 'Nepodařilo se smazat' })
    }
  }

  res.setHeader('Allow', ['PUT', 'DELETE'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
