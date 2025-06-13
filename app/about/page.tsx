/* page.tsx */
import Image from 'next/image'
import styles from './page.module.css'
import { prisma } from '@/lib/prisma'

interface PortfolioItem {
  id: number
  title: string
  pdfUrl: string
}

export default async function AboutPage() {
  const kate = await prisma!.person.findUnique({
    where: { name: 'Ing. arch. Kateřina Harazimová' },
    include: { portfolioItems: true },
  })

  return (
    <>
      <main className={styles.container}>
        {/* Sekce „O společnosti“ */}
        <section className={styles.section}>
          <h1 className={styles.heading}>O nás</h1>
          <p className={styles.text}>
            Forhaus je architektonická a projekční kancelář, která funguje jako volné sdružení samostatných projektantů, architekta a rozpočtáře.
            Jsme schopni zajistit návrh a projekční přípravu staveb, urbanistických celků a interiérů.
            Máme za sebou desítky úspěšných realizací nejen v Uherském Hradišti.
            Zprostředkujeme i kontakty na dotační agentury a jiné specialisty.
            Nabízíme i dílčí činnosti jako samostatná statická posouzení, inženýrskou činnost, návrh zateplení objektů a projekty jako dokumentace bouracích prací.
          </p>
        </section>

        {/* Sekce „Tým“ */}
        <section className={styles.section}>
          <h2 className={styles.heading}>Náš tým</h2>

          {/* Kateřina */}
          <p className={styles.text}>
            <strong>Ing. arch. Kateřina Harazimová</strong> – architektura, urbanismus, interiéry
          </p>
          {kate?.portfolioItems?.length ? (
            <ul className={styles.list}>
              {kate.portfolioItems.map(item => (
                <li key={item.id}>
                  <a href={`/api/portfolio/${item.id}/download`} download>
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}

          {/* Ostatní členové */}
          <p className={styles.text}>
            <strong>Ing. Jan Rýpal</strong> – stavební projektant, statik
          </p>
          <p className={styles.text}>
            <strong>Ing. Dana Jakšíková</strong> – stavební projektant
          </p>
          <p className={styles.text}>
            <strong>Jaroslav Kužela</strong> – rozpočtář
          </p>
        </section>

        {/* Sekce „Naše služby“ */}
        <section className={styles.section}>
          <h2 className={styles.heading}>Naše služby</h2>
          <p className={styles.text}>
            <strong>Architektonické a projekční práce pozemních staveb, statika</strong>
          </p>
          <ul className={styles.list}>
            <li>Přípravy projektu,</li>
            <li>Návrh stavby - architektonická studie,</li>
            <li>Projekt pro povolení záměru,</li>
            <li>Projekt pro provádění stavby,</li>
            <li>Technický a autorský dozor, kolaudační rozhodnutí,</li>
            <li>Dokumentace skutečného provádění stavby</li>
          </ul>
          <p className={styles.text}>
            Dále poskytujeme rozpočtování, inženýrskou činnost (vyjádření a stanoviska dotčených orgánů, správců sítí apod.) a veškerou komunikaci s úřady.<br />
            V rámci přípravy projektu zpracujeme zaměření stávajících budov, dokumentaci bouracích prací, pasportizaci staveb.<br />
            Součástí nabídky jsou i dílčí a specializované projekty jako návrh zateplení objektů, optimalizace vytápění budov nebo statické výpočty a posouzení. Kromě pozemních staveb nabízíme i urbanistické návrhy menšího rozsahu, návrhy interiéru a zprostředkování návrhů sadových úprav, geodetického zaměření pozemku a staveb, průkazu energetické náročnosti budov, odnětí ze ZPF a veškerých průzkumů.
          </p>
        </section>

        {/* Sekce „Historie a vývoj“ */}
        <section className={styles.section}>
          <h2 className={styles.heading}>Historie a vývoj</h2>
          <p className={styles.text}>
            Volné sdružení Forhaus vzniklo v březnu roku 2021.
          </p>
          <p className={styles.text}>
            Dnes sdružení spolupracuje s řadou osvědčených externích partnerů a podílí se na desítkách projektů ročně po celé České republice.
          </p>
        </section>

        {/* Dolní obrázkový pruh */}
        <section className={styles.imagesBar}>
          <div className={styles.imagesBarInner}>
            {['/img1.webp', '/img2.jpg', '/img3.jpg'].map((src, i) => (
              <div key={i} className={styles.imageWrapper}>
                <Image
                  src={src}
                  alt={`Naše práce ${i + 1}`}
                  fill
                  priority
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}