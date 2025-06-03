import type { NextApiRequest, NextApiResponse } from 'next'
import formidable, { File as FormidableFile } from 'formidable'
import fs from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'

export const config = { api: { bodyParser: false } }

function parseForm(req: NextApiRequest) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  fs.mkdirSync(uploadDir, { recursive: true })
  const form = formidable({ uploadDir, keepExtensions: true })
  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) =>
      form.parse(req, (err, fields, files) =>
        err ? reject(err) : resolve({ fields, files })
      )
  )
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string }

  if (req.method === 'PUT') {
    try {
      const { fields, files } = await parseForm(req)
      const label = Array.isArray(fields.label) ? fields.label[0] : fields.label ?? ''
      const category = Array.isArray(fields.category) ? fields.category[0] : fields.category ?? ''
      const uploaded = files.file as FormidableFile | FormidableFile[] | undefined
      const file = Array.isArray(uploaded) ? uploaded[0] : uploaded

      const old = await prisma.reference.findUnique({ where: { id } })
      if (!old) return res.status(404).json({ error: 'Reference nenalezena' })

      let src = old.src
      if (file) {
        const oldRel = old.src.replace(/^\//, '')
        await fs.promises.unlink(path.join(process.cwd(), 'public', oldRel)).catch(() => {})
        const filename = path.basename(file.filepath)
        src = `/uploads/${filename}`
      }

      const updated = await prisma.reference.update({
        where: { id },
        data: { label, category, src },
      })
      return res.status(200).json(updated)
    } catch (e) {
      console.error('PUT error:', e)
      return res.status(500).json({ error: 'Nepodařilo se upravit' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const old = await prisma.reference.findUnique({ where: { id } })
      if (old) {
        const oldRel = old.src.replace(/^\//, '')
        await fs.promises.unlink(path.join(process.cwd(), 'public', oldRel)).catch(() => {})
        await prisma.reference.delete({ where: { id } })
      }
      return res.status(200).json({ ok: true })
    } catch (e) {
      console.error('DELETE error:', e)
      return res.status(500).json({ error: 'Nepodařilo se smazat' })
    }
  }

  res.setHeader('Allow', ['PUT','DELETE'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
