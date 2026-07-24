/* ============================================================
   LARUM STUDIO — DICCIONARIO DE INTERFAZ ES / EN
   Ubicación: app/lib/i18n.ts

   Contiene ÚNICAMENTE strings de interfaz (labels, botones,
   navegación, formularios, estados). El contenido de la
   propiedad vive en property.json / property.en.json.

   Regla: ningún texto visible debe estar escrito dentro
   de PropertyPage.tsx. Todo pasa por aquí.
   ============================================================ */

export type Lang = 'es' | 'en'

export const LANGS: Lang[] = ['es', 'en']
export const DEFAULT_LANG: Lang = 'es'

/* Locale para Intl.NumberFormat y formateo de cifras.
   es-PY usa punto como separador de millar → "3.900"
   en-US usa coma → "3,900"
   Un comprador anglosajón lee "3.900" como tres coma nueve. */
export const LOCALE: Record<Lang, string> = {
  es: 'es-PY',
  en: 'en-US',
}

export const HTML_LANG: Record<Lang, string> = {
  es: 'es-PY',
  en: 'en',
}

export const dict = {
  es: {
    /* ---------- NAVEGACIÓN ---------- */
    nav: {
      residencia: 'Residencia',
      galeria: 'Galería',
      amenities: 'Amenities',
      entorno: 'Entorno',
      ubicacion: 'Ubicación',
      contacto: 'Contacto',
      cta: 'Solicitar agenda privada',
      menuAbrir: 'Abrir menú',
      menuCerrar: 'Cerrar menú',
      idioma: 'Idioma',
      cambiarIdioma: 'Cambiar a inglés',
    },

    /* ---------- HERO ---------- */
    hero: {
      scroll: 'Scroll',
      precio: 'Precio',
      accesoPrivado: 'Acceso privado',
      visitasBajoCita: 'Visitas bajo cita.',
    },

    /* ---------- STATS ---------- */
    stats: {
      terreno: 'Terreno',
      construidos: 'Construidos',
      dormitorios: 'Dormitorios',
      banos: 'Baños',
      cocheras: 'Cocheras',
      ano: 'Año',
    },

    /* ---------- SECCIONES ---------- */
    secciones: {
      recorrido: 'Recorrido',
      recorridoCompleto: 'Recorrido completo · 4K',
      laHistoria: 'La Historia',
      galeria: 'Galería',
      verGaleriaCompleta: 'Ver galería completa',
      amenitiesTitulo: 'Bienestar en\ncada detalle.',
      amenitiesDesc:
        'Espacios diseñados para disfrutar en familia, recibir con elegancia y relajarse en completo confort.',
      unDiaEnCasa: 'Un día en esta casa',
      unDiaEnCasaDesc:
        'No se visita. Se habita. Así transcurre una jornada cualquiera.',
      diaYNoche: 'Día y noche, misma toma',
      plano: 'Distribución',
      superficieAprox: 'Superficie aprox.',
      ambiente: 'Ambiente',
      gastosEstimados: 'Gastos estimados',
      concepto: 'Concepto',
      importe: 'Importe',
      recursos: 'Recursos',
      documentacion: 'Documentación',
      garantias: 'Garantías',
      calculadoras: 'Calculadoras',
      calculaCosteCompra: 'Calcula el coste de compra',
      puntosDeInteres: 'Puntos de interés',
      faq: 'Preguntas frecuentes',
      loQueNoSeVe: 'Lo que no se ve',
      loQueNoSeVeDesc:
        'Las decisiones técnicas que no aparecen en las fotos y que sostienen el valor de la casa.',
      inversion: 'Inversión',
      elAsesor: 'El asesor',
      contacto: 'Contacto',
    },

    /* ---------- AMENITIES (tabs) ---------- */
    amenities: {
      bienestar: 'Bienestar',
      exterior: 'Exterior',
      servicios: 'Servicios',
      bienestarDesc: 'Piscina, jacuzzi, gimnasio y descanso',
      exteriorDesc: 'Jardín, terraza, vistas y entorno',
      serviciosDesc: 'Seguridad, parking, cocina gourmet',
    },

    /* ---------- DESCARGAS ---------- */
    descargas: {
      brochure: 'Descargar brochure',
      brochureLargo: 'Descargar brochure de la propiedad',
      brochureCta: 'Descargar brochure →',
      descargar: 'Descargar',
      abrir: 'Abrir',
      compartir: 'Compartir',
    },

    /* ---------- FORMULARIO ---------- */
    form: {
      nombre: 'Nombre',
      email: 'Email',
      whatsapp: 'WhatsApp',
      mensaje: 'Mensaje',
      requerido: '*',
      enviar: 'Solicitar agenda privada',
      enviando: 'Enviando…',
      exito: 'Solicitud recibida.',
      exitoDetalle: 'Le contactaremos en breve para coordinar la visita.',
      error: 'No se pudo enviar. Inténtelo de nuevo.',
      politica: 'política de privacidad',
      politicaPrefijo: 'Al enviar acepta nuestra',
    },

    /* ---------- CONTACTO / AGENTE ---------- */
    contacto: {
      whatsapp: 'WhatsApp',
      email: 'Email',
      linkedin: 'LinkedIn',
      instagram: 'Instagram',
      telefono: 'Teléfono',
      idiomas: 'Idiomas',
      credenciales: 'Credenciales',
      escanearQr: 'Escanear para compartir',
    },

    /* ---------- ACCESIBILIDAD ---------- */
    a11y: {
      volverArriba: 'Volver arriba',
      cerrar: 'Cerrar',
      anterior: 'Anterior',
      siguiente: 'Siguiente',
      reproducir: 'Reproducir vídeo',
      pausar: 'Pausar vídeo',
      silenciar: 'Silenciar',
      activarSonido: 'Activar sonido',
      pantallaCompleta: 'Pantalla completa',
      imagenDe: 'Imagen {n} de {total}',
      planoAlt: 'Plano de distribución',
      qrAlt: 'Código QR de la propiedad',
      mapaAlt: 'Mapa de ubicación',
      amenitiesAlt: 'Espacios y amenities',
      diaAlt: 'La propiedad de día',
      nocheAlt: 'La propiedad de noche',
      retratoAsesor: 'Retrato del asesor',
    },

    /* ---------- COMÚN ---------- */
    comun: {
      incluido: 'Incluido',
      consultar: 'Consultar',
      mes: 'mes',
      min: 'min',
      km: 'km',
      de: 'de',
      y: 'y',
    },
  },

  en: {
    /* ---------- NAVIGATION ---------- */
    nav: {
      residencia: 'Residence',
      galeria: 'Gallery',
      amenities: 'Amenities',
      entorno: 'The Area',
      ubicacion: 'Location',
      contacto: 'Contact',
      cta: 'Request a private viewing',
      menuAbrir: 'Open menu',
      menuCerrar: 'Close menu',
      idioma: 'Language',
      cambiarIdioma: 'Switch to Spanish',
    },

    /* ---------- HERO ---------- */
    hero: {
      scroll: 'Scroll',
      precio: 'Price',
      accesoPrivado: 'Private access',
      visitasBajoCita: 'By appointment only.',
    },

    /* ---------- STATS ---------- */
    stats: {
      terreno: 'Plot',
      construidos: 'Built area',
      dormitorios: 'Bedrooms',
      banos: 'Bathrooms',
      cocheras: 'Garage',
      ano: 'Built',
    },

    /* ---------- SECTIONS ---------- */
    secciones: {
      recorrido: 'Tour',
      recorridoCompleto: 'Full tour · 4K',
      laHistoria: 'The Story',
      galeria: 'Gallery',
      verGaleriaCompleta: 'View full gallery',
      amenitiesTitulo: 'Comfort in\nevery detail.',
      amenitiesDesc:
        'Spaces designed for family life, for entertaining with ease, and for genuine rest.',
      unDiaEnCasa: 'A day in this house',
      unDiaEnCasaDesc:
        'Not a place you visit. A place you live in. This is an ordinary day.',
      diaYNoche: 'Day and night, same frame',
      plano: 'Floor plan',
      superficieAprox: 'Approx. area',
      ambiente: 'Room',
      gastosEstimados: 'Estimated running costs',
      concepto: 'Item',
      importe: 'Amount',
      recursos: 'Resources',
      documentacion: 'Documentation',
      garantias: 'Assurances',
      calculadoras: 'Calculators',
      calculaCosteCompra: 'Estimate your purchase costs',
      puntosDeInteres: 'Points of interest',
      faq: 'Frequently asked questions',
      loQueNoSeVe: 'What the photographs do not show',
      loQueNoSeVeDesc:
        'The technical decisions that never appear in a photograph, and that hold the value of the house.',
      inversion: 'Investment',
      elAsesor: 'The advisor',
      contacto: 'Contact',
    },

    /* ---------- AMENITIES (tabs) ---------- */
    amenities: {
      bienestar: 'Wellness',
      exterior: 'Outdoors',
      servicios: 'Services',
      bienestarDesc: 'Pool, jacuzzi, gym and rest',
      exteriorDesc: 'Garden, terrace, views and grounds',
      serviciosDesc: 'Security, parking, gourmet kitchen',
    },

    /* ---------- DOWNLOADS ---------- */
    descargas: {
      brochure: 'Download brochure',
      brochureLargo: 'Download the property brochure',
      brochureCta: 'Download brochure →',
      descargar: 'Download',
      abrir: 'Open',
      compartir: 'Share',
    },

    /* ---------- FORM ---------- */
    form: {
      nombre: 'Name',
      email: 'Email',
      whatsapp: 'WhatsApp',
      mensaje: 'Message',
      requerido: '*',
      enviar: 'Request a private viewing',
      enviando: 'Sending…',
      exito: 'Request received.',
      exitoDetalle: 'We will be in touch shortly to arrange your visit.',
      error: 'Something went wrong. Please try again.',
      politica: 'privacy policy',
      politicaPrefijo: 'By submitting, you accept our',
    },

    /* ---------- CONTACT / ADVISOR ---------- */
    contacto: {
      whatsapp: 'WhatsApp',
      email: 'Email',
      linkedin: 'LinkedIn',
      instagram: 'Instagram',
      telefono: 'Phone',
      idiomas: 'Languages',
      credenciales: 'Credentials',
      escanearQr: 'Scan to share',
    },

    /* ---------- ACCESSIBILITY ---------- */
    a11y: {
      volverArriba: 'Back to top',
      cerrar: 'Close',
      anterior: 'Previous',
      siguiente: 'Next',
      reproducir: 'Play video',
      pausar: 'Pause video',
      silenciar: 'Mute',
      activarSonido: 'Unmute',
      pantallaCompleta: 'Fullscreen',
      imagenDe: 'Image {n} of {total}',
      planoAlt: 'Floor plan',
      qrAlt: 'Property QR code',
      mapaAlt: 'Location map',
      amenitiesAlt: 'Spaces and amenities',
      diaAlt: 'The property by day',
      nocheAlt: 'The property by night',
      retratoAsesor: 'Portrait of the advisor',
    },

    /* ---------- COMMON ---------- */
    comun: {
      incluido: 'Included',
      consultar: 'On request',
      mes: 'month',
      min: 'min',
      km: 'km',
      de: 'of',
      y: 'and',
    },
  },
} as const

export type Dict = (typeof dict)['es']

export function getDict(lang: Lang): Dict {
  return dict[lang] as Dict
}

/* ============================================================
   AMENITIES — CATÁLOGO DESACOPLADO DEL IDIOMA

   PROBLEMA QUE RESUELVE:
   Antes, amenityIcons estaba indexado por el texto en español
   ('PISCINA INFINITY'). Al traducir a 'INFINITY POOL' los
   iconos caían todos al DEFAULT y las tabs se descuadraban
   porque categorizeAmenity usaba regex en castellano.

   SOLUCIÓN: clave semántica estable + label por idioma.
   El icono y la categoría se resuelven por `key`, nunca
   por el texto visible.
   ============================================================ */

export type AmenityCategory = 'bienestar' | 'exterior' | 'servicios'

export interface AmenityDef {
  key: string
  category: AmenityCategory
  es: string
  en: string
}

export const AMENITY_CATALOG: AmenityDef[] = [
  { key: 'infinity_pool',   category: 'bienestar', es: 'Piscina infinity',   en: 'Infinity pool' },
  { key: 'private_gym',     category: 'bienestar', es: 'Gimnasio privado',   en: 'Private gym' },
  { key: 'indoor_jacuzzi',  category: 'bienestar', es: 'Jacuzzi interior',   en: 'Indoor jacuzzi' },
  { key: 'garden',          category: 'exterior',  es: 'Jardín exterior',    en: 'Landscaped garden' },
  { key: 'private_terrace', category: 'exterior',  es: 'Terraza privada',    en: 'Private terrace' },
  { key: 'panoramic_view',  category: 'exterior',  es: 'Vista panorámica',   en: 'Panoramic views' },
  { key: 'gourmet_kitchen', category: 'servicios', es: 'Cocina gourmet',     en: 'Gourmet kitchen' },
  { key: 'parking',         category: 'servicios', es: 'Estacionamiento',    en: 'Covered parking' },
  { key: 'security_24h',    category: 'servicios', es: 'Seguridad 24 h',     en: '24h security' },
]

const amenityByKey = new Map(AMENITY_CATALOG.map(a => [a.key, a]))

export function getAmenity(key: string): AmenityDef | undefined {
  return amenityByKey.get(key)
}

export function amenityLabel(key: string, lang: Lang): string {
  const a = amenityByKey.get(key)
  if (!a) return key
  return lang === 'en' ? a.en : a.es
}

export function amenityCategory(key: string): AmenityCategory {
  return amenityByKey.get(key)?.category ?? 'servicios'
}

/* ============================================================
   FORMATEO DE CIFRAS Y UNIDADES
   ============================================================ */

/** Formatea un número con el separador correcto del idioma. */
export function formatNumber(n: number, lang: Lang): string {
  return new Intl.NumberFormat(LOCALE[lang]).format(n)
}

const SQM_TO_SQFT = 10.7639

/**
 * Superficie con doble unidad en inglés.
 * ES → "800 m²"
 * EN → "800 m² (8,610 sq ft)"
 *
 * Se duplica, no se sustituye: un comprador de Miami piensa
 * en sq ft, uno de Londres o Dubái en m². Sustituir confunde;
 * duplicar da autoridad.
 */
export function formatArea(sqm: number, lang: Lang): string {
  const m = formatNumber(sqm, lang)
  if (lang === 'es') return `${m} m²`
  const sqft = formatNumber(Math.round(sqm * SQM_TO_SQFT), lang)
  return `${m} m² (${sqft} sq ft)`
}

/** Extrae el valor numérico de "3.900 m²" o "3,900 m²" → 3900 */
export function parseAreaValue(raw: string): number | null {
  if (!raw) return null
  const m = raw.match(/[\d.,]+/)
  if (!m) return null
  const cleaned = m[0].replace(/[.,](?=\d{3}\b)/g, '').replace(',', '.')
  const n = parseFloat(cleaned)
  return Number.isFinite(n) ? n : null
}

/** Precio: "USD 3.500.000" en ES → "USD 3,500,000" en EN */
export function formatPrice(price: number, lang: Lang): string {
  return `USD ${formatNumber(price, lang)}`
}

/**
 * Hora en formato del idioma.
 * ES → 24 h  ("20:15")
 * EN → 12 h  ("8:15 PM")
 *
 * Corrige además el error existente "20:15 PM", que mezcla
 * formato 24 h con sufijo PM y no es válido en ningún idioma.
 */
export function formatTime(hhmm: string, lang: Lang): string {
  const m = hhmm.match(/^(\d{1,2}):(\d{2})/)
  if (!m) return hhmm
  const h = parseInt(m[1], 10)
  const min = m[2]
  if (lang === 'es') return `${String(h).padStart(2, '0')}:${min}`
  const suffix = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${min} ${suffix}`
}

/** Sustituye {n} y {total} en cadenas de accesibilidad. */
export function interpolate(
  template: string,
  vars: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    vars[k] !== undefined ? String(vars[k]) : `{${k}}`
  )
}

/* ============================================================
   DETECCIÓN Y PERSISTENCIA DE IDIOMA
   ============================================================ */

export const LANG_STORAGE_KEY = 'larum_lang'

/** Idioma guardado por el visitante, si existe. */
export function getStoredLang(): Lang | null {
  if (typeof window === 'undefined') return null
  try {
    const v = window.localStorage.getItem(LANG_STORAGE_KEY)
    return v === 'es' || v === 'en' ? v : null
  } catch {
    return null
  }
}

export function storeLang(lang: Lang): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang)
  } catch {
    /* modo privado: se ignora en silencio */
  }
}

/**
 * Idioma sugerido en la PRIMERA visita, a partir del navegador.
 * Solo se usa si no hay preferencia guardada.
 * Alguien que entra desde Miami con el navegador en inglés
 * cae directo en /en sin tener que tocar nada.
 */
export function detectBrowserLang(): Lang {
  if (typeof navigator === 'undefined') return DEFAULT_LANG
  const langs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language]
  for (const l of langs) {
    if (!l) continue
    const base = l.toLowerCase().split('-')[0]
    if (base === 'es') return 'es'
    if (base === 'en') return 'en'
  }
  return DEFAULT_LANG
}

/** Ruta equivalente en el otro idioma, preservando la sección. */
export function altPath(pathname: string, target: Lang): string {
  const clean = pathname.replace(/^\/en(?=\/|$)/, '') || '/'
  if (target === 'en') return clean === '/' ? '/en' : `/en${clean}`
  return clean
}
