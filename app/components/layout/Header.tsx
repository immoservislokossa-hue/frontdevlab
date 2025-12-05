"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Menu, X } from "lucide-react"

interface HeaderProps {
  title?: string
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full bg-blue-700 text-white py-3 px-4 md:py-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 md:w-12 md:h-12">
            <Image
              src="/PENSIPAY.png"
              alt="Logo PensiPay"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 40px, 48px"
            />
          </div>
          <span className="text-xl font-bold md:text-2xl">
            {title || "PensiPay"}
          </span>
        </div>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <a 
            href="#connect" 
            className="hover:text-yellow-300 transition-colors duration-200 text-lg font-medium"
          >
            Se connecter
          </a>
          <a 
            href="#balance" 
            className="hover:text-yellow-300 transition-colors duration-200 text-lg font-medium"
          >
            Consulter mon solde
          </a>
        </nav>

        {/* Menu Mobile Toggle */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-3 border-t border-blue-600 pt-4">
          <div className="flex flex-col gap-4 px-4">
            <a 
              href="#connect" 
              className="hover:text-yellow-300 transition-colors duration-200 text-lg font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Se connecter
            </a>
            <a 
              href="#balance" 
              className="hover:text-yellow-300 transition-colors duration-200 text-lg font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Consulter mon solde
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header