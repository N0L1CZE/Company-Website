import Image from 'next/image'
import styles from './page.module.css'

export default function AboutPage() {
  return (
    <>

      <main className={styles.container}>
        {/* Sekce „O společnosti“ */}
        <section className={styles.section}>
          <h1 className={styles.heading}>O nás</h1>
          <p className={styles.text}>
            Forhaus je architektonická a projekční kancelář, která funguje jako volné sdružení samostatných projektantů, architekta a rozpočtáře.
            Jsme schopni zajistit návrh a projekční přípravu staveb, urbanistických celků a interiérů.
            Máme za sebou desítky úspěšných realizací nejen v Uherském Hradišti.
            Zprostředkujeme i kontakty na dotační agentury a jiné specialisty.
            Nabízíme i dílčí činnosti jako samostatná statická posouzení, inženýrskou činnost, návrh zateplení objektů a projekty jako dokumentace bouracích prací.
          </p>
          <p className={styles.text}>Ing. arch. Kateřina Harazimová – architektura, urbanismus, interiéry<br />
          Ing. Jan Rýpal – stavební projektant, statik<br />
          Ing. Dana Jakšíková – stavební projektant<br />
          Jaroslav Kužela – rozpočtář</p>
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
            Dále poskytujeme rozpočtování, inženýrskou činnost (vyjádření a stanoviska dotčených orgánů, správců sítí apod.) a veškerou komunikaci s úřady<br />
            V rámci přípravy projektu zpracujeme zaměření stávajících budov, dokumentaci bouracích prací, pasportizaci staveb.<br />
            Součástí nabídky jsou i dílčí a specializované projekty jako návrh zateplení objektů, optimalizace vytápění budov nebo statické výpočty a posouzení. Kromě pozemních staveb nabízíme i urbanistické návrhy menšího rozsahu, návrhy interiéru a jsme schopni zprostředkovat návrhy sadových úprav, geodetické zaměření pozemku a staveb, průkaz energetické náročnosti budov, odnětí ze ZPF a veškeré průzkumy aj.
          </p>
        </section>

        {/* Sekce „Historie a vývoj“ */}
        <section className={styles.section}>
          <h2 className={styles.heading}>Historie a vývoj</h2>
          <p className={styles.text}>
            Volné sdružení Forhaus vzniklo v březnu roku 2021
          </p>
          <p className={styles.text}>
            Dnes sdružení spolupracuje s řadou osvědčených externích partnerů a podílí se na desítkách
            projektů ročně po celé České republice.
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
