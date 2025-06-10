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

// dynamicky získáme kategorie z dat
const CATEGORIES = Array.from(new Set<string>(
  // @ts-ignore
  (typeof window !== 'undefined' ? [] : []).concat() // workaround to satisfy TS
))

export default function ClientReferences({
  projects,
  persons,
}: {
  projects: Reference[]
  persons: Person[]
}) {
  // sestav seznam kategorií přímo z projects
  const categories = Array.from(new Set(projects.map(p => p.category)))

  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedPerson, setSelectedPerson]     = useState<string>('')

  const filtered = projects.filter(r => {
    const okCat = !selectedCategory || r.category === selectedCategory
    const okPers = !selectedPerson || r.persons.some(p => p.id === selectedPerson)
    return okCat && okPers
  })

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
          <option value="">— Všechny kategorie —</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
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
          <option value="">— Všichni autoři —</option>
          {persons.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.galleryBar}>
        <div className={styles.galleryInner}>
          {filtered.length === 0 && (
            <p className={styles.noResults}>Žádné projekty k zobrazení.</p>
          )}
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
