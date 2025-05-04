"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Globe } from "lucide-react"
import { type Language, languageNames, languageDirections } from "../translations"

interface LanguageSelectorProps {
  currentLanguage: Language
  onLanguageChange: (language: Language) => void
}

// Make the language selector more casual
export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const languages: Language[] = ["en", "ar", "zh", "es", "hi", "fr", "pt", "bn", "ru", "ja"]

  const handleLanguageSelect = (language: Language) => {
    onLanguageChange(language)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 md:gap-2 bg-[#16213e] hover:bg-[#1e2a4a] transition-colors px-2 py-1 md:px-3 md:py-2 rounded-lg text-xs md:text-sm"
      >
        <Globe size={14} />
        <span className="hidden xs:inline">{languageNames[currentLanguage]}</span>
        <span className="xs:hidden">{currentLanguage.toUpperCase()}</span>
        <ChevronDown size={12} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 bg-[#16213e] rounded-lg shadow-xl z-50 w-36 md:w-48 max-h-60 md:max-h-80 overflow-y-auto">
          {languages.map((language) => (
            <button
              key={language}
              onClick={() => handleLanguageSelect(language)}
              className={`w-full text-left px-3 py-1.5 md:px-4 md:py-2 hover:bg-[#1e2a4a] transition-colors text-xs md:text-sm ${
                language === currentLanguage ? "bg-[#1e2a4a] font-medium" : ""
              } ${languageDirections[language] === "rtl" ? "text-right" : "text-left"}`}
              dir={languageDirections[language]}
            >
              {languageNames[language]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
