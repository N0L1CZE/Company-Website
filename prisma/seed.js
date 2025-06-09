// prisma/seed.js
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  // 0) Admin uživatel – e-mail a heslo bereme z .env
  const adminEmail    = process.env.ADMIN_EMAIL
  const plainPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !plainPassword) {
    console.error('❌ Prosím nastavte v .env ADMIN_EMAIL a ADMIN_PASSWORD')
    process.exit(1)
  }

  // Zahashujeme heslo
  const passwordHash = await bcrypt.hash(plainPassword, 10)

  // Upsert admina
  await prisma.user.upsert({
    where:  { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash },
  })
  console.log(`✅ Admin seeded (email: ${adminEmail})`)

  // 1) Persons
  const names = [
    'Ing. Jan Rýpal',
    'Ing. arch Kateřina Harazimová',
    'Ing. Dana Jakšíková',
    'Jaromír Kužela',
  ]
  for (const name of names) {
    await prisma.person.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }
  console.log('✅ Persons seeded')

  // 2) ContactText
  const contactItems = [
    { key: 'contact.title',                 content: 'Kontakt' },
    { key: 'contact.company.name',          content: 'ForHaus – Architektonická a projekční kancelář' },
    { key: 'contact.company.address',       content: `Palackého náměstí 231\n686 01 Uherské Hradiště\n(3. NP vlevo)` },
    { key: 'contact.person.rypal.name',     content: 'Ing. Jan Rýpal' },
    { key: 'contact.person.rypal.role',     content: 'Autorizovaný inženýr, Projektant pozemních staveb, statik' },
    { key: 'contact.person.rypal.details',  content: `Číslo autorizace ČKAIT 1301388\nIČO: 62 81 93 48\nE-mail: rypaljan@seznam.cz / rypal@forhaus-uh.cz\nTel: 720 020 388\nNádražní 355\n696 85 Moravský Písek` },
    { key: 'contact.person.harazimova.name',    content: 'Ing. arch. Kateřina Harazimová' },
    { key: 'contact.person.harazimova.role',    content: 'Autorizovaný architekt' },
    { key: 'contact.person.harazimova.details', content: `Číslo autorizace ČKA 05078\nIČO: 09 76 45 85\nE-mail: kaharazimova@gmail.com / harazimova@forhaus-uh.cz\nTel: 774 936 020\nŠafaříkova 720\n686 01 Uherské Hradiště` },
    { key: 'contact.person.jaksikova.name',    content: 'Ing. Dana Jakšíková' },
    { key: 'contact.person.jaksikova.role',    content: 'Projektant pozemních staveb' },
    { key: 'contact.person.jaksikova.details', content: `IČO: 14 25 73 60\nE-mail: Dana.jaksa@seznam.cz / jaksikova@forhaus-uh.cz\nTel: 724 052 310\nKněžpole 208\n687 12 Kněžpole` },
    { key: 'contact.person.kuzela.name',       content: 'Jaromír Kužela' },
    { key: 'contact.person.kuzela.role',       content: 'Rozpočtář' },
    { key: 'contact.person.kuzela.details',    content: `IČO: 10 85 32 01\nE-mail: jaromir.kuzela8@gmail.com / kuzela@forhaus-uh.cz\nTel: 731 782 932\nVlčnov 514\n687 61 Vlčnov` },
  ]

  for (const item of contactItems) {
    await prisma.contactText.upsert({
      where:  { key: item.key },
      update: { content: item.content },
      create: item,
    })
  }
  console.log('✅ ContactText items seeded')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
