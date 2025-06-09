import Link from 'next/link'
import Image from 'next/image'
import styles from './page.module.css'

export default function OurWorkPage() {
  const items = [
    {
      title: 'Projektová činnost',
      text: 'Naše firma nabízí profesionální projektovou činnost od plánování až po realizaci. Zajišťujeme hladký průběh projektů, dodržení termínů, rozpočtu a požadavků klienta.',
      icon: '/icons/project.svg',
      href: './our-work/Projects'        
    },
    {
      title: 'Inženýrská činnost',
      text: 'Nabízíme odbornou inženýrskou činnost zahrnující přípravu, koordinaci i technický dohled. Díky zkušenostem garantujeme kvalitu a spolehlivost výsledků.',
      icon: '/icons/engineering.svg',
      href: './our-work/Engineering'                       
    },
    {
      title: 'Pasportizace objektů',
      text: 'Provádíme pasportizaci objektů včetně detailní dokumentace stávajícího stavu. Zajistíme přesné zaměření, evidenci prvků a přehledné výstupy pro další využití.',
      icon: '/icons/passport.svg',
      href: './our-work/Passport'
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
                    width={120}
                    height={120}
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
