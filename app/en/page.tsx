import type { Metadata } from 'next'
import { SITE } from '../lib/site'
import PropertyPage from '../components/PropertyPage'
import data from '../data/property.en.json'

export const metadata: Metadata = {
  title: `${data.property.name} — ${data.property.badge}`,
  description: data.property.tagline,
  alternates: {
    canonical: SITE + '/en',
    languages: {
      en: SITE + '/en',
      'es-PY': SITE + '/',
      'x-default': SITE + '/',
    },
  },
  openGraph: {
    title: data.property.heroHeadline,
    description: data.property.tagline,
    url: SITE + '/en',
    locale: 'en_US',
    alternateLocale: ['es_PY'],
    images: [{ url: data.property.posterHero }],
    type: 'website',
  },
}

export default function Page() {
  return <PropertyPage data={data} lang="en" />
}
