import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

// Vypneme vestavěné parsování, abychom ručně přečetli JSON
export const config = { api: { bodyParser: false } }

// Pomocná funkce pro čtení těla jako JSON
async function readJson<T>(req: NextApiRequest): Promise<T> {
  let body = ''
  for await (const chunk of req) {
    body += chunk
  }
  return JSON.parse(body) as T
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // --------------------------------------------------
  // GET /api/references — vylistuje všechny reference
  // --------------------------------------------------
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

  // --------------------------------------------------
  // POST /api/references — vytvoří novou referenci z JSON
  // --------------------------------------------------
  if (req.method === 'POST') {
    try {
      // Čteme request jako JSON
      const { label, category, personIds, src } = await readJson<{
        label: string
        category: string
        personIds: string[]
        src: string
      }>(req)

      // Validace
      if (
        typeof label !== 'string' ||
        typeof category !== 'string' ||
        !Array.isArray(personIds) ||
        typeof src !== 'string'
      ) {
        return res.status(400).json({ error: 'Chybné nebo chybějící údaje' })
      }

      // Uložíme do DB a připojíme osoby
      const created = await prisma.reference.create({
        data: {
          label,
          category,
          src,
          persons: {
            connect: personIds.map((id: string) => ({ id })),
          },
        },
        include: { persons: true },
      })

      return res.status(201).json(created)
    } catch (err) {
      console.error('POST /api/references error:', err)
      return res.status(500).json({ error: 'Chyba při vytváření reference' })
    }
  }

  // --------------------------------------------------
  // Jiné metody nejsou povoleny
  // --------------------------------------------------
  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
