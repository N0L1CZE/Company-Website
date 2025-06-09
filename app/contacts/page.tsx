'use client'

import styles from './page.module.css'

export default function ContactsPage() {
  return (
    <>

      <main className={styles.container}>
        <h1 className={styles.title}>Kontakt</h1>
        <div className={styles.content}>
          {/* levý sloupec s kontakty */}
          <div className={styles.info}>
            <h2 className={styles.infoHeading}>ForHaus -  Architektonická a projekční kancelář</h2>
            <address className={styles.address}>
              Palackého náměstí 231<br />
              686 01 Uherské Hradiště<br />
              (3. NP vlevo)<br />
            </address>

            <h3 className={styles.infoSubheading}><strong>Ing. Jan Rýpal</strong></h3>
            <p className={styles.contactLine}><strong>Autorizovaný inženýr, Projektant pozemních staveb, statik</strong><br />
            Číslo autorizace ČKAIT 1301388<br />
            IČO: 62 81 93 48<br />
            E-mail: rypaljan@seznam.cz / rypal@forhaus-uh.cz<br />
            Tel: 720 020 388<br />
            Nádražní 355<br />
            696 85 Moravský Písek
            </p>

            <h3 className={styles.infoSubheading}><strong>Ing. arch. Kateřina Harazimová</strong></h3>
            <p className={styles.contactLine}><strong>Autorizovaný architekt</strong><br />
            Číslo autorizace ČKA 05078<br />
            IČO: 09 76 45 85<br />
            E-mail: kaharazimova@gmail.com / harazimova@forhaus-uh.cz<br />
            Tel: 774 936 020<br />
            Šafaříkova 720<br />
            686 01 Uherské Hradiště
            </p>

            <h3 className={styles.infoSubheading}><strong>Ing. Dana Jakšíková</strong></h3>
            <p className={styles.contactLine}><strong>Projektant pozemních staveb</strong><br />
            IČO: 14 25 73 60<br />
            E-mail: Dana.jaksa@seznam.cz / jaksikova@forhaus-uh.cz<br />
            Tel: 724 052 310<br />
            Kněžpole 208<br />
            687 12 Kněžpole
            </p>

            <h3 className={styles.infoSubheading}><strong>Jaromír Kužela</strong></h3>
            <p className={styles.contactLine}><strong>Rozpočtář</strong><br />
            IČO: 10 85 32 01<br />
            E-mail: jaromir.kuzela8@gmail.com / kuzela@forhaus-uh.cz<br />
            Tel: 731 782 932<br />
            Vlčnov 514<br />
            687 61 Vlčnov
            </p>
          </div>

          {/* pravý sloupec s mapou */}
          <div className={styles.map}>
            <h2 className={styles.mapHeading}>Kde nás najdete</h2>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3121.1039275261187!2d17.461499776781967!3d49.068258885914176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47131438684ce9db%3A0xc33e0d111dad6efd!2zUGFsYWNrw6lobyBuw6FtLiAyMTMsIDY4NiAwMSBVaGVyc2vDqSBIcmFkacWhdMSbIDE!5e1!3m2!1scs!2scz!4v1749492571859!5m2!1scs!2scz"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </main>

    </>
  )
}
