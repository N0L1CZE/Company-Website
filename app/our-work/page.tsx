import Link from 'next/link'
import Image from 'next/image'
import styles from './page.module.css'

export default function OurWorkPage() {
  const items = [
    {
      title: 'Příprava projektů, projekční podklady',
      text: 'Před započetím jakéhokoliv návrhu je třeba zajistit nezbytné podklady. Jedná se o zaměření a průzkumy pozemku a okolí. Vše jsme schopni zajistit a zkoordinovat. V rámci přípravy se ujasní zadání a potřeby klienta. Předběžně se analyzuje území stavby, soulad s územním plánem a jinými regulačními podmínkami, předběžné ekonomické zhodnocení a jaké podklady budou potřeba.',
      icon: '/icons/project.svg',
      href: './our-work/Projects'        
    },
    {
      title: 'Návrh stavby - studie',
      text: 'Zpracováváme studie architektonické (stavba), urbanistické (území) a studie interiéru.  Jejich cílem je grafické a vizuální znázornění konkrétního řešení dle Vašeho zadání.',
      icon: '/icons/engineering.svg',
      href: './our-work/Engineering'                       
    },
    {
      title: 'Projekt pro povolení stavby',
      text: 'Nový stavební zákon sloučil územní a stavební řízení do jednoho. Projekt je hlavní dokumentací pro povolení záměru úřady. Součástí je zajištění vyjádření a stanovisek od správců sítí a dotčených orgánů (inženýrská činnost).',
      icon: '/icons/passport.svg',
      href: './our-work/Passport'
    },
    {
      title: 'Projekt pro provedení stavby',
      text: 'Tato dokumentace vychází ze platné dokumentace pro stavební povolení. Specifikuje požadavky na kvalitu stavby a představuje „návod“ na její realizaci. Součástí je položkový rozpočet a výkaz výměr pro výběr dodavatele.',
      icon: '/icons/projekt_provedeni.svg',
      href: './our-work/projekt_pro_provedeni_stavby'
    },
    {
      title: 'Autorský a technický dozor, kolaudační rozhodnutí',
      text: 'Po dobu realizace stavby dohlíží zpracovatel (autor) dokumentace na její dodržování a schvaluje případné změny. Technický dozor stavebníka (klienta) je povinný u všech veřejně financovaných staveb a dohlíží na provádění stavby. Kolaudační řízení je povolení stavebního úřadu, že lze nyní stavbu užívat ke stanovenému účelu.',
      icon: '/icons/autorsky_technicky.svg',
      href: './our-work/autorsky_a_technicky_dozor_kolaudacni_rozhodnuti'
    },
    {
      title: 'Dokumentace skutečného provedení stavby',
      text: 'Tato dokumentace odráží skutečnou podobu stavby po jejím dokončení a jsou zde zapracovány všechny změny. Je prakticky shodná s prováděcí dokumentací. Vlastník stavby je nově povinen ji pořídit a uchovávat po celou dobu trvání stavby.',
      icon: '/icons/dokumentace.svg',
      href: './our-work/dokumentace_skutecneho_provedeni_stavby'
    },
  ]

  return (
    <>

      <main className={styles.container}>
        <h1 className={styles.pageTitle}>Naše práce</h1>

        <div className={styles.cardGrid}>
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={styles.card}
            >
              <div className={styles.cardInner}>
                <h2 className={styles.cardTitle}>{item.title}</h2>
                <p className={styles.cardText}>{item.text}</p>
                <div className={styles.iconWrapper}>
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={80}
                    height={80}
                    priority
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

    </>
  )
}
