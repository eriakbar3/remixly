'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'

export function ConditionalNavbar() {
  const pathname = usePathname()

  // Don't show Navbar on landing page - it has its own header
  if (pathname === '/') {
    return null
  }

  return <Navbar />
}
