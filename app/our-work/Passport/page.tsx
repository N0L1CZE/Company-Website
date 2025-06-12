export const metadata = {
  title: 'Forhaus | Projekt pro povolení stavby',
  description:
    'Forhaus UH – kompletní dokumentace pro povolení stavby v souladu s novým stavebním zákonem, včetně průvodní zprávy, technického zařízení budovy a nezbytných posudků.',
  applicationName: 'Forhaus',
  authors: [{ name: 'Forhaus UH', url: 'https://forhaus-uh.cz' }],
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: 'Forhaus | Projekt pro povolení stavby',
    description:
      'Detailní projektová dokumentace pro povolení stavby od Forhaus UH – situace, půdorysy, řezy, pohledy a inženýrské posudky.',
    url: 'https://forhaus-uh.cz/passport',
    siteName: 'Forhaus',
    images: [
      {
        url: 'https://forhaus-uh.cz/2.jpg',
        width: 1200,
        height: 630,
        alt: 'Projekt pro povolení stavby – Forhaus UH'
      }
    ],
    locale: 'cs_CZ',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forhaus | Projekt pro povolení stavby',
    description:
      'Forhaus UH nabízí projekt pro povolení stavby včetně všech technických a statických posudků.',
    images: ['https://forhaus-uh.cz/2.jpg'],
    site: '@forhausuh'
  }
}

import Image from 'next/image'
import styles from './page.module.css'

export default function PassportPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Projekt pro povolení stavby</h1>
      <div className={styles.content}>
        <div className={styles.textBlock}>
          <p className={styles.lead}>
            Dokumentace obsahuje průvodní a technickou zprávu, situace, půdorysy, řezy, pohledy. Dále je možné zpracovat řešení technického zařízení budovy (vytápění, zásobování vodou, elektřinou, teplem apod.), i když podle nového stavebního zákona to není povinné.
          </p>
          <p className={styles.lead}>
            Přikládá se i statický výpočet, hydrogeologický posudek na vsakování a na základě požadavku hygieny např. i akustická studie. Zpracováváme rovněž požárně bezpečnostní řešení, průkaz energetické náročnosti budov, vynětí ze zemědělského půdního fondu, povolení kácení dřevin, návrh sadových úprav, aj.
            Zařídíme jednání s úřady, správci sítí, dotčenými orgány a ostatními účastníky řízení.
          </p>
          <p className={styles.lead}>
            Nově není třeba dokumentaci tisknout, jelikož digitalizace procesu vyžaduje pouze pdf, ale dle domluvy poskytujeme i výtisky.
          </p>
        </div>
        <div className={styles.imageWrapper}>
          <Image
            src="/2.jpg"
            alt="Pasportizace objektů"
            width={550}
            height={367}
            className={styles.image}
          />
        </div>
      </div>

      {/* Vzorová dokumentace */}
      <h2 className={styles.subheading}>Vzorová dokumentace</h2>
      <ul className={styles.list}>
        <li>
          <a href="/docs/01_PUDORYS.pdf" download>
            Půdorys (PDF)
          </a>
        </li>
        <li>
          <a href="/docs/02_REZY.pdf" download>
            Řezy (PDF)
          </a>
        </li>
        <li>
          <a href="/docs/03_REZ C-C.pdf" download>
            Řez C-C (PDF)
          </a>
        </li>
        <li>
          <a href="/docs/04_POHLEDY.pdf" download>
            Pohledy (PDF)
          </a>
        </li>
        <li>
          <a href="/docs/05_APARTMAN_PUDORYS.pdf" download>
            Apartmán - Půdorys (PDF)
          </a>
        </li>
        <li>
          <a href="/docs/06_APARTMAN_POHLEDY.pdf" download>
            Apartmán - Pohledy (PDF)
          </a>
        </li>
      </ul>
    </main>
  )
}
