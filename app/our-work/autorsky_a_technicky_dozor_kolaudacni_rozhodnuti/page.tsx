'use client'
export const metadata = {
  title: 'Forhaus | Autorský a technický dozor, kolaudační rozhodnutí',
  description:
    'Forhaus UH – poskytujeme autorský a technický dozor při realizaci staveb i kompletní servis kolaudačního řízení.',
  applicationName: 'Forhaus',
  authors: [{ name: 'Forhaus UH', url: 'https://forhaus-uh.cz' }],
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: 'Forhaus | Autorský a technický dozor, kolaudační rozhodnutí',
    description:
      'Detailní popis našich služeb autorského a technického dozoru stavby a kompletního kolaudačního procesu.',
    url: 'https://forhaus-uh.cz/our-work/autorsky_a_technicky_dozor_kolaudacni_rozhodnuti',
    siteName: 'Forhaus',
    images: [
      {
        url: 'https://forhaus-uh.cz/5.jpg',
        width: 1200,
        height: 630,
        alt: 'Autorský a technický dozor – Forhaus UH'
      }
    ],
    locale: 'cs_CZ',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forhaus | Autorský a technický dozor, kolaudační rozhodnutí',
    description:
      'Zajistíme autorský a technický dozor stavebního projektu a kompletní kolaudační řízení.',
    images: ['https://forhaus-uh.cz/5.jpg'],
    site: '@forhausuh'
  }
}

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
              src="/5.jpg"
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
