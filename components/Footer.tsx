'use client'

import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()
  
  // Hide footer on login page for clean experience
  if (pathname === '/login') {
    return null
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-8 bg-white/5 backdrop-blur-sm border-t border-white/10 z-10">
      <div className="flex items-center justify-center h-full text-xs text-gray-500/70 px-4">
        © {currentYear} AiPPcC • Healthcare Operations Excellence Platform • Less chaos, more patient care
      </div>
    </footer>
  )
}
