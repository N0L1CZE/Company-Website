// app/references/ClientReferences.tsx
'use client'

import { useState, ChangeEvent } from 'react'
import Image from 'next/image'
import styles from './page.module.css'

interface Person {
  id: string
  name: string
}
interface Reference {
  id: string
  label: string
  src: string
  category: string
  persons: Person[]
}

const CATEGORIES = [
  { value: 'Obytné a polyfunkční stavby',       label: 'Obytné a polyfunkční stavby' },
  { value: 'Komerční a administrativní stavby', label: 'Komerční a administrativní stavby' },
  { value: 'Občanská vybavenost',               label: 'Občanská vybavenost' },
  { value: 'Zdravotnictví a školství',          label: 'Zdravotnictví a školství' },
  { value: 'Průmyslové a zemědělské stavby',     label: 'Průmyslové a zemědělské stavby' },
  { value: 'Interiér, drobná architektura',     label: 'Interiér, drobná architektura' },
  { value: 'Urbanismus, komunikace',            label: 'Urbanismus, komunikace' },
  { value: 'Ostatní',                           label: 'Ostatní' },
]

export default function ClientReferences({
  projects,
  persons,
}: {
  projects: Reference[]
  persons: Person[]
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPerson, setSelectedPerson]     = useState<string>('all')

  const filtered = projects.filter(r =>
    (selectedCategory === 'all' || r.category === selectedCategory) &&
    (selectedPerson === 'all'   || r.persons.some(p => p.id === selectedPerson))
  )

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Reference</h1>

      <div className={styles.filterBar}>
        <label htmlFor="filterCategory" className={styles.filterLabel}>
          Kategorie:
        </label>
        <select
          id="filterCategory"
          className={styles.filterSelect}
          value={selectedCategory}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setSelectedCategory(e.target.value)
          }
        >
          <option value="all">Všechny</option>
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <label htmlFor="filterPerson" className={styles.filterLabel}>
          Osoba:
        </label>
        <select
          id="filterPerson"
          className={styles.filterSelect}
          value={selectedPerson}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setSelectedPerson(e.target.value)
          }
        >
          <option value="all">Vše</option>
          {persons.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.galleryBar}>
        <div className={styles.galleryInner}>
          {filtered.map(r => (
            <div key={r.id} className={styles.card}>
              <div className={styles.cardImage}>
                <Image
                  src={r.src}
                  alt={r.label}
                  fill
                  sizes="(max-width: 600px) 100vw, 30vw"
                />
              </div>
              {/* nově samostatný blok s názvem a osobami */}
              <div className={styles.cardInfo}>
                <h3 className={styles.cardLabel}>{r.label}</h3>
                <p className={styles.cardPersons}>
                  {r.persons.map(p => p.name).join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
