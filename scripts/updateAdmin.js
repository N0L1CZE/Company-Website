// scripts/updateAdmin.js
require('dotenv').config()
const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) {
    console.error('Chybí ADMIN_EMAIL nebo ADMIN_PASSWORD v env')
    process.exit(1)
  }
  const hash = await bcrypt.hash(password, 10)
  await prisma.user.update({
    where: { email },
    data: { passwordHash: hash },
  })
  console.log('✅ Heslo admina aktualizováno.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())