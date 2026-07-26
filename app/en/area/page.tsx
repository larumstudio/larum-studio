import type { Metadata } from 'next'
import { SITE } from '../../lib/site'
import EntornoPage from '../../components/EntornoPage'
import location from '../../data/location.en.json'

export const metadata: Metadata = {
  title: 'San Bernardino, Paraguay | Lakeside Living Near Asunción | Larum',
  description:
    'Discover San Bernardino: a private lakeside residential setting on Lake Ypacaraí, less than an hour from Asunción.',
  alternates: {
    canonical: SITE + '/en/area',
    languages: {
      en: SITE + '/en/area',
      'es-PY': SITE + '/entorno',
      'x-default': SITE + '/entorno',
    },
  },
  openGraph: {
    title: location.hero.title,
    description: location.hero.subtitle,
    url: SITE + '/en/area',
    locale: 'en_US',
    alternateLocale: ['es_PY'],
    images: [{ url: location.hero.image }],
    type: 'website',
  },
}

export default function Page() {
  return <EntornoPage location={location} lang="en" />
}
