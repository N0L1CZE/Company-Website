'use client'
export const metadata = {
  title: 'Forhaus | Projekt pro provedení stavby',
  description:
    'Forhaus UH – detailní prováděcí projekt staveb určený k realizaci, včetně technického zařízení budov a výrobní dokumentace.',
  applicationName: 'Forhaus',
  authors: [{ name: 'Forhaus UH', url: 'https://forhaus-uh.cz' }],
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: 'Forhaus | Projekt pro provedení stavby',
    description:
      'Kompletní prováděcí projekt od Forhaus UH: standardy, kvalita materiálů a technické řešení pro stavbu.',
    url: 'https://forhaus-uh.cz/our-work/projekt_provedeni_stavby',
    siteName: 'Forhaus',
    images: [
      {
        url: 'https://forhaus-uh.cz/1.jpg',
        width: 1200,
        height: 630,
        alt: 'Projekt pro provedení stavby – Forhaus UH'
      }
    ],
    locale: 'cs_CZ',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forhaus | Projekt pro provedení stavby',
    description:
      'Forhaus UH zajišťuje podrobný prováděcí projekt staveb včetně technických detailů a výrobní dokumentace.',
    images: ['https://forhaus-uh.cz/1.jpg'],
    site: '@forhausuh'
  }
}

import Image from 'next/image'
import styles from './page.module.css'

export default function ForProjectPage() {
  return (
    <>

      <main className={styles.container}>
        <h1 className={styles.title}>Projekt pro provedení stavby</h1>

        <div className={styles.content}>
          <div className={styles.textBlock}>
            <p className={styles.lead}>
              <p>
                Projekt je zpracován v takových podrobnostech, aby bylo možné stavbu realizovat.
              </p>
              <p>
                Stanovuje standard, kvalitu materiálů a způsoby provedení. Prováděcí projekt je nyní povinný a již musí obsahovat řešení technického zařízení budovy (vytápění, zásobování vodou, elektřinou, teplem apod.)
              </p>

              Zpracovává se jednotlivě pro pozemní objekty (budovy), inženýrské objekty (např. komunikace, studna) a technologická zařízení (zpravidla průmyslová zařízení). 
              Projekt pro provádění stavby je podkladem pro realizační dokumentaci zhotovitele stavby, tzn. výrobní a dílenskou dokumentaci.
              Dokumentaci vytiskneme i předáme digitálně.
            </p>
          </div>

          <div className={styles.imageWrapper}>
            <Image
              src="/1.jpg"
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
