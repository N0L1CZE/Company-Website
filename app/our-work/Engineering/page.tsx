'use client'

import Image from 'next/image'
import { Header } from 'app/components/Header/Header'
import { Footer } from 'app/components/Footer/Footer'
import styles from './page.module.css'

export default function EngineeringPage() {
  return (
    <>

      <main className={styles.container}>
        <h1 className={styles.title}>Inženýrská činnost</h1>

        <div className={styles.content}>
          <div className={styles.textBlock}>
            <p className={styles.lead}>
              Zajišťujeme kompletní inženýrskou činnost ve výstavbě, tedy veškeré kroky potřebné 
              pro získání povolení a hladký průběh projektu. Klientům šetříme čas i starosti díky 
              profesionálnímu zastupování na úřadech a při jednání s dotčenými orgány.
            </p>

            <h2 className={styles.subheading}>Co zařídíme?</h2>
            <ul className={styles.list}>
              <li>Vyjádření správců sítí a dotčených orgánů</li>
              <li>Podání žádostí o územní rozhodnutí a stavební povolení</li>
              <li>Koordinaci s projektanty a profesemi</li>
              <li>Zastupování investora během celého procesu</li>
            </ul>

            <h2 className={styles.subheading}>Pro koho je služba vhodná?</h2>
            <ul className={styles.list}>
              <li>Pro soukromé stavebníky, firmy i obce</li>
              <li>Při nové výstavbě, přestavbě i legalizaci staveb</li>
              <li>Pro každého, kdo chce ušetřit čas a mít jistotu správného postupu</li>
            </ul>
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
      </main>

    </>
  )
}
