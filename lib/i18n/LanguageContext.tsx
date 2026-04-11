'use client'

import { createContext, useContext, useState } from 'react'
import { t as translate, type Lang, type TranslationKey } from './translations'

interface LanguageContextValue {
  lang: Lang
  t: (key: TranslationKey, vars?: Record<string, string>) => string
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'ro',
  t: (key) => key as string,
})

export function LanguageProvider({
  children,
  initialLang,
}: {
  children: React.ReactNode
  initialLang: Lang
}) {
  const [lang] = useState<Lang>(initialLang)

  function t(key: TranslationKey, vars?: Record<string, string>) {
    return translate(lang, key, vars)
  }

  return (
    <LanguageContext.Provider value={{ lang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
