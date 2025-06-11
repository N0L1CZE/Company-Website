// app/portfolio/page.tsx
import { prisma } from '@/lib/prisma'
import type { Person, PortfolioItem } from '@prisma/client'
import styles from './page.module.css'

/**
 * PortfolioItem teď obsahuje i pole `persons`
 * (M-N relace PortfolioPersons).
 */
type ItemWithPersons = PortfolioItem & { persons: Person[] }
type PersonWithItems = Person & { portfolioItems: ItemWithPersons[] }

export default async function PortfolioPage() {
  const persons: PersonWithItems[] = await prisma.person.findMany({
    orderBy: { name: 'asc' },
    include: {
      portfolioItems: {
        include: { persons: true },      // ← vezmeme autory k PDF
      },
    },
  })

  return (
    <main className={styles.wrapper}>
      <h1 className="text-3xl font-bold mb-6">Portfolio</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {persons.map(person => (
          <div
            key={person.id}
            className="border rounded-lg p-4 shadow-sm flex flex-col"
          >
            <h2 className="text-xl font-semibold mb-4">{person.name}</h2>

            <ul className="flex-1 space-y-2 mb-4">
              {person.portfolioItems.length > 0 ? (
                person.portfolioItems.map(item => (
                  <li key={item.id}>
                    <a
                      href={item.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {item.title}
                    </a>
                    <br />
                    <small className="text-gray-600">
                      {item.persons.map(p => p.name).join(', ')}
                    </small>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">Žádné položky</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </main>
  )
}
