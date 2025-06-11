// app/references/page.tsx
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
