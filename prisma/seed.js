// prisma/seed.js
require('dotenv').config()
const bcrypt = require('bcrypt') 
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // 0) DELETE ALL PORTFOLIO ITEMS (to avoid FK violations)
  await prisma.portfolioItem.deleteMany()
  console.log('🗑️ All portfolio items deleted')

  // 1) DELETE ALL PERSONS (clean slate)
  await prisma.person.deleteMany()
  console.log('⚠️ All persons deleted — ready to seed')

  // 2) Admin user
  const adminEmail = process.env.ADMIN_EMAIL
  const adminHash  = process.env.ADMIN_PASSWORD_HASH

  if (adminEmail && adminHash) {
    const adminHash = await bcrypt.hash(adminPassword, 10)
    await prisma.user.upsert({
      where:  { email: adminEmail },
      update: { passwordHash: adminHash },
      create: { email: adminEmail, passwordHash: adminHash },
    })
    console.log(`✅ Admin seeded (email: ${adminEmail})`)
  } else {
    console.warn('⚠️ ADMIN_EMAIL or ADMIN_PASSWORD_HASH not set — skipping admin seed')
  }

  // 3) Persons
  const personNames = [
    'Ing. Jan Rýpal',
    'Ing. arch. Kateřina Harazimová',
    'Ing. Dana Jakšíková',
    'Jaroslav Kužela',
  ]
  for (const name of personNames) {
    await prisma.person.upsert({
      where:  { name },
      update: {},
      create: { name },
    })
  }
  console.log('✅ Persons seeded')

  // 4) ContactText items
  const contactItems = [
    { key: 'contact.title',                content: 'Kontakt' },
    { key: 'contact.company.name',         content: 'ForHaus – Architektonická a projekční kancelář' },
    { key: 'contact.company.address',      content: `Palackého náměstí 231\n686 01 Uherské Hradiště\n(3. NP vlevo)` },
    { key: 'contact.person.rypal.name',    content: 'Ing. Jan Rýpal' },
    { key: 'contact.person.rypal.role',    content: 'Autorizovaný inženýr, Projektant pozemních staveb, statik' },
    { key: 'contact.person.rypal.details', content: `Číslo autorizace ČKAIT 1301388\nIČO: 62 81 93 48\nE-mail: rypaljan@seznam.cz / rypal@forhaus-uh.cz\nTel: 720 020 388\nNádražní 355\n696 85 Moravský Písek` },
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
      create: { key: item.key, content: item.content },
    })
  }
  console.log('✅ ContactText items seeded')
}

main()
  .catch(e => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
