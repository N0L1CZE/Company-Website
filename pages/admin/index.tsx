// pages/admin/index.tsx
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { parse } from 'cookie'
import { verify } from 'jsonwebtoken'

export default function AdminDashboard() {
  return (
    <main style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Admin Dashboard</h1>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 20 }}>
        <li style={{ marginBottom: 10 }}>
          <Link href="/">Zpět na úvodní stránku</Link>
        </li>
        <li style={{ marginBottom: 10 }}>
          <Link href="/admin/references">Správa referencí</Link>
        </li>
        <li style={{ marginBottom: 10 }}>
          <Link href="/admin/contact-texts">Texty na stránce Kontakt</Link>
        </li>
        {/* Další odkazy na admin sekce */}
      </ul>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookies = parse(req.headers.cookie ?? '')
  if (!cookies.auth_token) {
    return { redirect: { destination: '/auth/login', permanent: false } }
  }
  try {
    verify(cookies.auth_token, process.env.JWT_SECRET!)
  } catch {
    return { redirect: { destination: '/auth/login', permanent: false } }
  }

  return { props: {} }
}
