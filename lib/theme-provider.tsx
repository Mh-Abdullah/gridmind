'use client'

import { useEffect, ReactNode } from 'react'

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    const isDarkMode = savedTheme === 'dark' || (savedTheme === null && prefersDark)

    const html = document.documentElement
    if (isDarkMode) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }, [])

  return <>{children}</>
}
