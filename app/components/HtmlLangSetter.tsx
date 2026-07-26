'use client'
/* ============================================================
   HtmlLangSetter — ajusta <html lang> en cliente
   ------------------------------------------------------------
   Next.js App Router solo permite un root layout. El HTML se
   sirve con lang="es-PY". Este componente, montado desde la
   rama /en, cambia el atributo a "en" en cuanto se hidrata.
   ============================================================ */
import { useEffect } from 'react'

export default function HtmlLangSetter({ lang }: { lang: string }) {
  useEffect(() => {
    if (typeof document === 'undefined') return
    const prev = document.documentElement.lang
    document.documentElement.lang = lang
    return () => {
      document.documentElement.lang = prev
    }
  }, [lang])
  return null
}
