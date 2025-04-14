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
        className="flex items-center gap-2 bg-[#16213e] hover:bg-[#1e2a4a] transition-colors px-3 py-2 rounded-lg text-sm"
      >
        <Globe size={16} />
        <span>{languageNames[currentLanguage]}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 bg-[#16213e] rounded-lg shadow-xl z-50 w-48 max-h-80 overflow-y-auto">
          {languages.map((language) => (
            <button
              key={language}
              onClick={() => handleLanguageSelect(language)}
              className={`w-full text-left px-4 py-2 hover:bg-[#1e2a4a] transition-colors ${
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
