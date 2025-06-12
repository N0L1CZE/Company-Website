// app/references/page.tsx
export const metadata = {
  title: 'Forhaus | Reference',
  description:
    'Reference Forhaus UH – výběr našich dokončených projektů v kategoriích a podle autorů.',
  applicationName: 'Forhaus',
  authors: [{ name: 'Forhaus UH', url: 'https://forhaus-uh.cz' }],
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: 'Forhaus | Reference',
    description:
      'Prohlédněte si reference od Forhaus UH: projekty rozdělené podle kategorií i podle členů týmu.',
    url: 'https://forhaus-uh.cz/references',
    siteName: 'Forhaus',
    images: [
      {
        url: 'https://forhaus-uh.cz/img1.webp',
        width: 1200,
        height: 630,
        alt: 'Reference projektů – Forhaus UH'
      }
    ],
    locale: 'cs_CZ',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forhaus | Reference',
    description:
      'Reference Forhaus UH – kolekce našich realizací, filtrování podle kategorie a odpovědných osob.',
    images: ['https://forhaus-uh.cz/img1.webp'],
    site: '@forhausuh'
  }
}

import ClientReferences from './ClientReferences'
import { prisma } from '@/lib/prisma'

// ⬇️ toto zajistí, že stránka nebude cacheovaná
export const dynamic = 'force-dynamic'

export default async function ReferencesPage() {
  const projects = await prisma.reference.findMany({
    include: { persons: true },
    orderBy: { createdAt: 'desc' },
  })
  const persons = await prisma.person.findMany({ orderBy: { name: 'asc' } })
  return <ClientReferences projects={projects} persons={persons} />
}
