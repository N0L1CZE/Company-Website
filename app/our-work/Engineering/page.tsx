// app/engineering/page.tsx
'use client'

import Image from 'next/image'
import styles from './page.module.css'

export default function EngineeringPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Návrh stavby – studie</h1>

      <div className={styles.content}>
        <div className={styles.textBlock}>
          <p className={styles.lead}>
            Studie stavby specifikuje řešení urbanistické, architektonické, dispoziční, provozní, konstrukční,
            technické, technologické, interiérové a materiálové. Dokumentace obsahuje průvodní zprávu s popisem řešení,
            výkresy situace, půdorysů, řezů a pohledů. Vše je možné znázornit i pomocí vizualizací.
          </p>
          <p className={styles.lead}>
            Urbanistická studie řeší prostorové a provozní uspořádání většího území (bez konkrétního návrhu jednotlivých staveb).
            Studie interiéru má za úkol navrhnout vybavení vnitřních prostor – od jednoho nábytkového kusu přes samostatnou místnost po celé budovy. Specifikuje materiálové, prostorové a
            barevné řešení, dále návaznost na stavbu (elektroinstalace, připojení na vodu a odkanalizování apod.). Na studii je možné navázat projektem, který představuje podklad pro dodavatele interiéru.
            Vše je možné poskytnou v digitálních formátech i fyzických výtiscích.
          </p>
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src="/engineer-cinnost.jpg"
            alt="Projektová činnost"
            width={550}
            height={367}
            className={styles.image}
          />
        </div>
      </div>

      {/* ——— hard-coded vzorová dokumentace ——— */}
      <h2 className={styles.subheading}>Vzorová dokumentace</h2>
      <ul className={styles.list}>
        <li>
          <a href="/docs/vzor1.jpg" download>
            Vzorový přiklad 1
          </a>
        </li>
        <li>
          <a href="/docs/vzor2.jpg" download>
            Vzorový příklad 2
          </a>
        </li>
        <li>
          <a href="/docs/vzor3.jpg" download>
            Vzorový příklad 3
          </a>
        </li>
        <li>
          <a href="/docs/vzor4.jpg" download>
            Vzorový příklad 4
          </a>
        </li>
        <li>
          <a href="/docs/vzor5.jpg" download>
            Vzorový příklad 5
          </a>
        </li>
        <li>
          <a href="/docs/vzor6.jpg" download>
            Vzorový příklad 6
          </a>
        </li>
        <li>
          <a href="/docs/vzor7.jpg" download>
            Vzorový příklad 7
          </a>
        </li>
        <li>
          <a href="/docs/vzor8.jpg" download>
            Vzorový příklad 8
          </a>
        </li>
        <li>
          <a href="/docs/vzor9.jpg" download>
            Vzorový příklad 9
          </a>
        </li>
      </ul>
    </main>
  )
}
