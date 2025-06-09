// app/contacts/page.tsx
import ContactClient from './ContactClient'
import { prisma } from '@/lib/prisma'

export default async function ContactPage() {
  // Načteme všechny texty pro kontakty
  const texts = await prisma.contactText.findMany()
  // Sestavíme objekt { [key]: content }
  const t: Record<string,string> = {}
  texts.forEach((item) => { t[item.key] = item.content })

  return <ContactClient texts={t} />
}
