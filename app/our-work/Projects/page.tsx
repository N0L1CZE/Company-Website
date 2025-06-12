export const metadata = {
  title: 'Forhaus | Příprava projektů, projekční podklady',
  description:
    'Forhaus UH – kompletní příprava projektů a projekční podklady: zaměření, průzkumy, hydrogeologie, pasportizace a další nezbytné studie.',
  applicationName: 'Forhaus',
  authors: [{ name: 'Forhaus UH', url: 'https://forhaus-uh.cz' }],
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: 'Forhaus | Příprava projektů, projekční podklady',
    description:
      'Zajišťujeme veškeré podklady pro projekty staveb: geometrické plány, průzkumy, pasportizace a další nezbytné dokumenty.',
    url: 'https://forhaus-uh.cz/our-work/Projects',
    siteName: 'Forhaus',
    images: [
      {
        url: 'https://forhaus-uh.cz/projekt-cinnost-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Příprava projektu – Forhaus UH'
      }
    ],
    locale: 'cs_CZ',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forhaus | Příprava projektů, projekční podklady',
    description:
      'Forhaus UH – odborná příprava projektů a projekční podklady včetně zaměření, průzkumů a pasportizace.',
    images: ['https://forhaus-uh.cz/projekt-cinnost-1.jpg'],
    site: '@forhausuh'
  }
}

import Image from 'next/image'
import styles from './page.module.css'

export default function ProjectPage() {
  return (
    <>

      <main className={styles.container}>
        {/* Nadpis */}
        <h1 className={styles.title}>Příprava projektu, projekční podklady</h1>

          {/* Sekce „Naše služby“ */} 
        <section className={styles.section}>
          <h2 className={styles.subheading}>Mezi projekční podklady patří např.:</h2>
          <ul className={styles.list}>
            <li>Geometrický plán</li>
            <li>zaměření pozemku (polohopis a výškopis); zaměření výšek okolních budov</li>
            <li>zaměření budov (v případě rekonstrukcí)</li>
            <li>inženýrsko-geologický průzkum</li>
            <li>hydrogeologický průzkum</li>
            <li>pedologický a radonový průzkum</li>
            <li>biologický a dendrologický průzkum</li>
            <li>mapa záplavových území</li>
            <li>archeologický průzkum</li>
            <li>fotodokumentace</li>
            <li>pasportizace okolních staveb</li>
            <li>měření hluku</li>
            <li>stavebně technický průzkum</li>
            <li>stavebně historický průzkum</li>
          </ul>
        </section>

           {/* Úvodní odstavec */}
        <p className={styles.intro}>
          K přípravě projektu je potřeba součinnost klienta jako např. předání podkladů, zajištění vstupu na pozemek nebo na stavbu, stanovení předpokládaných nákladů apod.
        </p>


        {/* Obrázkový pás */}
    <section className={styles.imagesBar}>
  <div className={styles.imagesBarInner}>
    {['/projekt-cinnost-1.jpg', '/projekt-cinnost-2.jpg', '/projekt-cinnost-3.jpg'].map((src, i) => (
      <div key={i} className={styles.imageWrapper}>
        <Image
          src={src}
          alt={`Ukázka ${i + 1}`}
          fill
          className={styles.image}
        />
      </div>
    ))}
  </div>
</section>
      </main>

    </>
  )
}
