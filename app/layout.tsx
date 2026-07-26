import type { Metadata } from 'next'
import { SITE } from './lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: 'Villa San Bernardino — Villa de Lujo · San Bernardino',
  description: 'Residencia frente al lago Ypacaraí. Visitas privadas bajo cita.',
  alternates: {
    canonical: SITE + '/',
    languages: {
      'es-PY': SITE + '/',
      en: SITE + '/en',
      'x-default': SITE + '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_PY',
    alternateLocale: ['en_US'],
    url: SITE + '/',
  },
}

/**
 * Script bloqueante que corrige <html lang> antes de que el navegador
 * pinte el body. Sirve HTML con lang="es-PY" por defecto; si la ruta
 * empieza por /en, se sobreescribe a "en" en microsegundos.
 *
 * Es mejor que useEffect en un client component porque:
 *  - No espera al hidrate de React (que puede tardar 200-800ms).
 *  - Corrige antes de que el screen reader anuncie la página.
 *  - Cuando Google Bot ejecuta JS, ya lee el atributo correcto.
 */
const LANG_FIX_SCRIPT = `(function(){try{if(location.pathname.indexOf('/en')===0){document.documentElement.lang='en';document.documentElement.setAttribute('data-lang','en')}else{document.documentElement.setAttribute('data-lang','es')}}catch(e){}})();`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-PY" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LANG_FIX_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Outfit:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
