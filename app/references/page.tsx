import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer/Footer'
import { prisma } from '@/lib/prisma'
import ClientReferences from './ClientReferences'

export default async function ReferencesPage() {
  const projects = await prisma.reference.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <ClientReferences projects={projects} />
    </>
  )
}
