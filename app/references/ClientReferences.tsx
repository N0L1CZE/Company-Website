'use client'
import { useState, ChangeEvent } from 'react'
import Image from 'next/image'
import styles from './page.module.css'

type Reference = {
  id: string
  label: string
  src: string
  category: string
}

export default function ClientReferences({
  projects,
}: {
  projects: Reference[]
}) {
  const [category, setCategory] = useState<string>('all')
  const [person, setPerson] = useState<string>('all')

  // Filtrujeme jak podle kategorie, tak podle osoby
  const filtered = projects.filter((p) =>
    (category === 'all' || p.category.toLowerCase() === category) &&
    (person === 'all'   || p.label === person)
  )

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Reference</h1>

      <div className={styles.filterBar}>
        {/* Dropdown pro kategorie */}
        <label htmlFor="category" className={styles.filterLabel}>
          Filtrovat podle kategorie:
        </label>
        <select
          id="category"
          className={styles.filterSelect}
          value={category}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setCategory(e.target.value)
          }
        >
          <option value="all">Vše</option>
          <option value="bytové domy">Bytové domy</option>
          <option value="komerční">Komerční</option>
          <option value="revitalizace">Revitalizace</option>
        </select>

        {/* Dropdown pro osoby */}
        <label htmlFor="person" className={styles.filterLabel}>
          Filtrovat podle osoby:
        </label>
        <select
          id="person"
          className={styles.filterSelect}
          value={person}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setPerson(e.target.value)
          }
        >
          <option value="all">Vše</option>
          <option value="Ing. Jan Rýpal">Ing. Jan Rýpal</option>
          <option value="Ing. arch Kateřina Harazimová">
            Ing. arch Kateřina Harazimová
          </option>
          <option value="Ing. Dana Jakšíková">Ing. Dana Jakšíková</option>
          <option value="Jaromír Kužela">Jaromír Kužela</option>
        </select>
      </div>

      <div className={styles.galleryBar}>
        <div className={styles.galleryInner}>
          {filtered.map((p) => (
            <div key={p.id} className={styles.card}>
              <div className={styles.cardImage}>
                <Image
                  src={p.src}
                  alt={p.label}
                  fill
                  sizes="(max-width: 600px) 100vw, 30vw"
                />
              </div>
              <button className={styles.cardButton}>{p.label}</button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
