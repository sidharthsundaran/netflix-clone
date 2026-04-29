"use client"

import { useState } from "react"

export default function Footer() {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("English")

  const languages = ["English", "Español", "Français", "Deutsch", "Italiano", "Português"]

  return (
    <footer className="bg-gray-7 text-gray-400 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Contact Information */}
        <div className="mb-8">
          <p className="text-sm">Questions? Call 000-800-919-1743 (Toll-Free)</p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="space-y-3">
            <span className="block text-sm cursor-pointer hover:text-white transition-colors">FAQ</span>
            <span className="block text-sm cursor-pointer hover:text-white transition-colors">Cookie Preferences</span>
          </div>

          <div className="space-y-3">
            <span className="block text-sm cursor-pointer hover:text-white transition-colors">Help Centre</span>
            <span className="block text-sm cursor-pointer hover:text-white transition-colors">Corporate Information</span>
          </div>

          <div className="space-y-3">
            <span className="block text-sm cursor-pointer hover:text-white transition-colors">Terms of Use</span>
          </div>

          <div className="space-y-3">
            <span className="block text-sm cursor-pointer hover:text-white transition-colors">Privacy</span>
          </div>
        </div>

        {/* Language Selector */}
        <div className="relative inline-block">
          <button
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-600 bg-transparent text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 0a9 9 0 019-9 9 9 0 01-9 9m0 0a9 9 0 01-9-9 9 9 0 019 9z"
              />
            </svg>
            <span className="text-sm">{selectedLanguage}</span>
            <svg
              className={`w-4 h-4 transition-transform ${isLanguageOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isLanguageOpen && (
            <div className="absolute bottom-full left-0 mb-1 bg-gray-900 border border-gray-600 rounded shadow-lg z-10">
              {languages.map((language) => (
                <button
                  key={language}
                  onClick={() => {
                    setSelectedLanguage(language)
                    setIsLanguageOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  {language}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
