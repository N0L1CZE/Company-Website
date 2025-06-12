export const metadata = {
  title: 'Forhaus | Dokumentace skutečného provedení stavby',
  description:
    'Forhaus UH – dokumentace skutečného provedení stavby reflektující všechny změny po dokončení projektu.',
  applicationName: 'Forhaus',
  authors: [{ name: 'Forhaus UH', url: 'https://forhaus-uh.cz' }],
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: 'Forhaus | Dokumentace skutečného provedení stavby',
    description:
      'Seznamte se s naší dokumentací skutečného provedení stavby, která zachycuje finální podobu a všechny zapracované změny.',
    url: 'https://forhaus-uh.cz/our-work/dokumentace_skutecneho_provedeni_stavby',
    siteName: 'Forhaus',
    images: [
      {
        url: 'https://forhaus-uh.cz/4.jpg',
        width: 1200,
        height: 630,
        alt: 'Dokumentace skutečného provedení stavby – Forhaus UH'
      }
    ],
    locale: 'cs_CZ',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forhaus | Dokumentace skutečného provedení stavby',
    description:
      'Detailní dokumentace skutečného provedení stavby od Forhaus UH, zahrnující všechny po dokončení realizace provedené změny.',
    images: ['https://forhaus-uh.cz/4.jpg'],
    site: '@forhausuh'
  }
}

'use client'

import Image from 'next/image'
import styles from './page.module.css'

export default function DocumentationPage() {
  return (
    <>

      <main className={styles.container}>
        <h1 className={styles.title}>Dokumentace skutečného provedení stavby</h1>

        <div className={styles.content}>
          <div className={styles.textBlock}>
            <p className={styles.lead}>
              Tato dokumentace odráží skutečnou podobu stavby po jejím dokončení a jsou zde zapracovány všechny změny. 
              Je prakticky shodná s prováděcí dokumentací. Vlastník stavby je nově povinen ji pořídit a uchovávat po celou dobu trvání stavby.
            </p>
          </div>

          <div className={styles.imageWrapper}>
            <Image
              src="/4.jpg"
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
