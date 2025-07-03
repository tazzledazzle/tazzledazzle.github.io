'use client'

import { useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: '/', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary-600">
              tazzledazzle
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary-600"
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          data-testid="mobile-menu"
          className={clsx(
            'md:hidden',
            isOpen ? 'block' : 'hidden'
          )}
        >
          <div className="pt-2 pb-3 space-y-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation