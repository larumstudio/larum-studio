'use client'
/* ============================================================
   app/components/LanguageSwitch.tsx  —  ARCHIVO NUEVO

   Selector ES | EN. Componente aislado: no toca nada más.

   - Par de códigos, no banderas ni icono de globo.
   - Enlaces reales (<a href>), no botones con router: el
     buscador los rastrea y el usuario puede abrir en pestaña
     nueva. Un toggle con onClick no da ninguna de las dos cosas.
   - Guarda la elección en localStorage.
   ============================================================ */
import React from 'react'
import { altPath, storeLang, type Lang } from '../lib/i18n'
import extraStyles from './improvements.module.css'

interface Props {
  lang: Lang
  /** Ruta actual. En la home basta con '/' o '/en'. */
  pathname?: string
  /** true dentro del menú móvil (más aire, separador superior) */
  mobile?: boolean
}

export default function LanguageSwitch({ lang, pathname, mobile = false }: Props) {
  const current =
    pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '/')

  const esHref = altPath(current, 'es')
  const enHref = altPath(current, 'en')

  const cls = `${extraStyles.langSwitch} ${mobile ? extraStyles.langSwitchMobile : ''}`

  const opt = (active: boolean) =>
    `${extraStyles.langOption} ${active ? extraStyles.langOptionActive : ''}`

  return (
    <div className={cls} role="group" aria-label={lang === 'es' ? 'Idioma' : 'Language'}>
      <a
        href={enHref}
        className={opt(lang === 'en')}
        hrefLang="en"
        aria-current={lang === 'en' ? 'true' : undefined}
        onClick={() => storeLang('en')}
      >
        EN
      </a>
      <span className={extraStyles.langDivider} aria-hidden="true" />
      <a
        href={esHref}
        className={opt(lang === 'es')}
        hrefLang="es"
        aria-current={lang === 'es' ? 'true' : undefined}
        onClick={() => storeLang('es')}
      >
        ES
      </a>
    </div>
  )
}
