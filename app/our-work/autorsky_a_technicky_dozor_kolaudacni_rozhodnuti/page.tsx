'use client'

import Image from 'next/image'
import styles from './page.module.css'

export default function AuthorPage() {
  return (
    <>

      <main className={styles.container}>
        <h1 className={styles.title}>Autorský a technický dozor, kolaudační rozhodnutí</h1>

        <div className={styles.content}>
          <div className={styles.textBlock}>
            <p className={styles.lead}>
              <p>
                Autorský dozor je možné poskytovat trvale po dobu realizace stavby v pravidelných intervalech nebo např. občasně na základě vzniklého problému nebo situace k řešení. Vše je předmětem domluvy.
              </p>

              <p>
                AD se účastní domluvených kontrolních prohlídek. Technický dozor stavebníka se účastní kontrolních prohlídek a spolupracuje na řešení vzniklých problémů.
              </p>
              Před uvedením stavby do provozu probíhá kolaudační řízení. Její součástí je mimo jiné dokumentace k povolení stavby se seznamem změn, adresa a číslo geometrického plánu a další přílohy. Na konci se provede závěrečná kontrolní prohlídka za účasti zástupce stavebního úřadu.
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
      </main>

    </>
  )
}
