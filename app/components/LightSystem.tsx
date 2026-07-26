/* ============================================================
   app/components/LightSystem.tsx  —  v3 TIME-LAPSE REAL
   ARCHIVO COMPLETO, REEMPLAZÁ EL ANTERIOR ENTERO.
   ============================================================ */

'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import extraStyles from './improvements.module.css'
import { formatTime, type Lang, type Dict } from '../lib/i18n'

/* ------------------------------------------------------------
   ESCALA DE LUZ COMPARTIDA
   ------------------------------------------------------------ */

export interface LightStop {
  pos: number
  glow: string
  accent: string
  tint: string
}

export const LIGHT_SCALE: LightStop[] = [
  { pos: 0.00, glow: 'rgba(255, 186, 108, 0.34)', accent: '#e8a765', tint: 'rgba(255, 176, 92, 0.16)'  },
  { pos: 0.20, glow: 'rgba(255, 214, 150, 0.28)', accent: '#e6bd80', tint: 'rgba(255, 208, 140, 0.10)' },
  { pos: 0.40, glow: 'rgba(240, 232, 205, 0.22)', accent: '#d9cfa8', tint: 'rgba(245, 238, 214, 0.05)' },
  { pos: 0.60, glow: 'rgba(214, 178, 120, 0.26)', accent: '#c8a45d', tint: 'rgba(226, 176, 104, 0.11)' },
  { pos: 0.80, glow: 'rgba(150, 140, 168, 0.28)', accent: '#9b8fb0', tint: 'rgba(120, 116, 168, 0.17)' },
  { pos: 1.00, glow: 'rgba(88, 104, 152, 0.32)',  accent: '#7d8bb5', tint: 'rgba(48, 62, 116, 0.26)'   },
]

function mixChannel(a: number, b: number, k: number) {
  return Math.round(a + (b - a) * k)
}

function parseRGBA(s: string): number[] {
  const m = s.match(/[\d.]+/g)
  if (!m) return [0, 0, 0, 1]
  return m.map(Number)
}

function lerpColor(c1: string, c2: string, k: number): string {
  if (c1.startsWith('#') || c2.startsWith('#')) {
    const hex = (h: string) => {
      const n = h.replace('#', '')
      return [
        parseInt(n.slice(0, 2), 16),
        parseInt(n.slice(2, 4), 16),
        parseInt(n.slice(4, 6), 16),
      ]
    }
    const [r1, g1, b1] = hex(c1)
    const [r2, g2, b2] = hex(c2)
    return `rgb(${mixChannel(r1, r2, k)}, ${mixChannel(g1, g2, k)}, ${mixChannel(b1, b2, k)})`
  }
  const p1 = parseRGBA(c1)
  const p2 = parseRGBA(c2)
  const a = (p1[3] ?? 1) + ((p2[3] ?? 1) - (p1[3] ?? 1)) * k
  return `rgba(${mixChannel(p1[0], p2[0], k)}, ${mixChannel(p1[1], p2[1], k)}, ${mixChannel(p1[2], p2[2], k)}, ${a.toFixed(3)})`
}

export function lightAt(pos: number): LightStop {
  const p = Math.min(Math.max(pos, 0), 1)
  let i = 0
  while (i < LIGHT_SCALE.length - 2 && LIGHT_SCALE[i + 1].pos < p) i++
  const a = LIGHT_SCALE[i]
  const b = LIGHT_SCALE[i + 1]
  const span = b.pos - a.pos || 1
  const k = (p - a.pos) / span
  return {
    pos: p,
    glow: lerpColor(a.glow, b.glow, k),
    accent: lerpColor(a.accent, b.accent, k),
    tint: lerpColor(a.tint, b.tint, k),
  }
}

export function hourToPos(hhmm: string): number {
  const m = hhmm.match(/^(\d{1,2}):(\d{2})/)
  if (!m) return 0
  const h = parseInt(m[1], 10) + parseInt(m[2], 10) / 60
  return Math.min(Math.max((h - 7) / 14, 0), 1)
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/* ============================================================
   4 ESTACIONES DEL DÍA
   ============================================================ */

interface Station {
  pos: number
  hour: { h: number, m: number }
  label: { es: string, en: string }
  desc:  { es: string, en: string }
}

const STATIONS: Station[] = [
  {
    pos: 0.00,
    hour: { h: 6, m: 0 },
    label: { es: 'Amanecer', en: 'Sunrise' },
    desc:  {
      es: 'La casa despierta. La luz entra fría, el lago aún no se ha movido.',
      en: 'The house wakes up. Light comes in cool, the lake has not yet stirred.',
    },
  },
  {
    pos: 0.33,
    hour: { h: 12, m: 0 },
    label: { es: 'Mediodía', en: 'Midday' },
    desc:  {
      es: 'Todo abierto. La terraza recibe, la piscina refleja, la casa respira.',
      en: 'Wide open. The terrace welcomes, the pool reflects, the house breathes.',
    },
  },
  {
    pos: 0.66,
    hour: { h: 18, m: 30 },
    label: { es: 'Atardecer', en: 'Sunset' },
    desc:  {
      es: 'El cielo se vuelve violeta. Las primeras luces interiores se encienden.',
      en: 'The sky turns violet. The first interior lights come on.',
    },
  },
  {
    pos: 1.00,
    hour: { h: 20, m: 30 },
    label: { es: 'Noche', en: 'Night' },
    desc:  {
      es: 'La casa se entrega. Luces, jardín, piscina. Te están esperando.',
      en: 'The house surrenders. Lights, garden, pool. They are waiting for you.',
    },
  },
]

function stationOpacities(p: number): [number, number, number, number] {
  const centers = [0, 0.33, 0.66, 1.0]
  const fadeWidth = 0.07
  const opacities: [number, number, number, number] = [0, 0, 0, 0]

  for (let i = 0; i < 4; i++) {
    if (i === 0) {
      if (p < centers[1] - fadeWidth) opacities[i] = 1
      else if (p < centers[1] + fadeWidth) {
        const t = (p - (centers[1] - fadeWidth)) / (fadeWidth * 2)
        opacities[i] = 1 - t
      } else opacities[i] = 0
    } else if (i === 3) {
      if (p < centers[2] - fadeWidth) opacities[i] = 0
      else if (p < centers[2] + fadeWidth) {
        const t = (p - (centers[2] - fadeWidth)) / (fadeWidth * 2)
        opacities[i] = t
      } else opacities[i] = 1
    } else {
      const prevCenter = centers[i - 1]
      const nextCenter = centers[i + 1]
      if (p < prevCenter - fadeWidth) opacities[i] = 0
      else if (p < prevCenter + fadeWidth) {
        const t = (p - (prevCenter - fadeWidth)) / (fadeWidth * 2)
        opacities[i] = t
      } else if (p < nextCenter - fadeWidth) {
        opacities[i] = 1
      } else if (p < nextCenter + fadeWidth) {
        const t = (p - (nextCenter - fadeWidth)) / (fadeWidth * 2)
        opacities[i] = 1 - t
      } else opacities[i] = 0
    }
  }
  return opacities
}

function currentHour(p: number): { h: number, m: number } {
  for (let i = 0; i < STATIONS.length - 1; i++) {
    const a = STATIONS[i]
    const b = STATIONS[i + 1]
    if (p >= a.pos && p <= b.pos) {
      const t = (p - a.pos) / (b.pos - a.pos)
      const eased = t * t * (3 - 2 * t)
      const aMin = a.hour.h * 60 + a.hour.m
      const bMin = b.hour.h * 60 + b.hour.m
      const total = aMin + (bMin - aMin) * eased
      return { h: Math.floor(total / 60), m: Math.floor(total % 60) }
    }
  }
  if (p <= 0) return STATIONS[0].hour
  return STATIONS[STATIONS.length - 1].hour
}

function currentStation(p: number): { current: Station, next: Station | null, blend: number } {
  for (let i = 0; i < STATIONS.length - 1; i++) {
    const a = STATIONS[i]
    const b = STATIONS[i + 1]
    if (p >= a.pos && p <= b.pos) {
      const t = (p - a.pos) / (b.pos - a.pos)
      return { current: a, next: b, blend: t }
    }
  }
  if (p <= 0) return { current: STATIONS[0], next: null, blend: 0 }
  const last = STATIONS[STATIONS.length - 1]
  return { current: last, next: null, blend: 0 }
}

/* ============================================================
   1 · DAY ARC
   ============================================================ */

export function DayArc({
  data,
  t,
  lang,
}: {
  data: any[]
  t: Dict
  lang: Lang
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const reduced = usePrefersReducedMotion()
  const onScroll = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setProgress(max > 0 ? el.scrollLeft / max : 0)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => el.removeEventListener('scroll', onScroll)
  }, [onScroll])

  if (!data?.length) return null

  const light = lightAt(progress)

  return (
    <section className={extraStyles.dayArcSection} id="un-dia">
      <div className={extraStyles.dayArcHeader}>
        <span className={extraStyles.dayArcEyebrow}>{t.secciones.unDiaEnCasa}</span>
        <p className={extraStyles.dayArcIntro}>{t.secciones.unDiaEnCasaDesc}</p>
      </div>

      <div className={extraStyles.dayArcAxis} aria-hidden="true">
        <div className={extraStyles.dayArcAxisLine} />
        <div
          className={extraStyles.dayArcAxisFill}
          style={{
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, ${LIGHT_SCALE[0].accent}, ${light.accent})`,
          }}
        />
        <div
          className={extraStyles.dayArcAxisDot}
          style={{
            left: `${progress * 100}%`,
            background: light.accent,
            boxShadow: `0 0 18px 3px ${light.glow}`,
          }}
        />
      </div>

      <div
        ref={trackRef}
        className={extraStyles.dayArcTrack}
        role="list"
        tabIndex={0}
        aria-label={t.secciones.unDiaEnCasa}
      >
        {data.map((item: any, i: number) => {
          const pos = hourToPos(item.hora)
          const l = lightAt(pos)
          return (
            <article
              key={i}
              role="listitem"
              className={extraStyles.dayArcCard}
              style={
                {
                  '--card-glow': l.glow,
                  '--card-accent': l.accent,
                  '--card-tint': l.tint,
                } as React.CSSProperties
              }
            >
              <div className={extraStyles.dayArcImgWrap}>
                {item.imagen ? (
                  <img
                    src={item.imagen}
                    alt={item.titulo}
                    loading={i < 2 ? 'eager' : 'lazy'}
                  />
                ) : (
                  <div className={extraStyles.dayArcImgEmpty} aria-hidden="true" />
                )}
                <div className={extraStyles.dayArcImgTint} />
              </div>
              <div className={extraStyles.dayArcBody}>
                <span className={extraStyles.dayArcHour}>
                  {formatTime(item.hora, lang)}
                </span>
                <h3 className={extraStyles.dayArcTitle}>{item.titulo}</h3>
                <p className={extraStyles.dayArcDesc}>{item.desc}</p>
              </div>
            </article>
          )
        })}
      </div>

      {!reduced && (
        <div className={extraStyles.dayArcHint} aria-hidden="true">
          <span className={extraStyles.dayArcHintLine} />
        </div>
      )}
    </section>
  )
}

/* ============================================================
   2 · DAY NIGHT SCROLL — v3 con 4 estaciones
   ============================================================ */

export function DayNightScroll({
  data,
  t,
  lang,
}: {
  data: any
  t: Dict
  lang: Lang
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const [p, setP] = useState(0.33)
  const [pSlider, setPSlider] = useState<number | null>(null)
  const [userInteracted, setUserInteracted] = useState(false)
  // Guardamos el index del botón clickeado. Si es null, se calcula
  // desde la posición del scroll. Si tiene valor, manda el botón.
  const [activeIndexFromButton, setActiveIndexFromButton] = useState<number | null>(1)
  const reduced = usePrefersReducedMotion()

  const sliderValue = userInteracted && pSlider !== null ? pSlider : p
  const progress = sliderValue

  useEffect(() => {
    if (reduced) return
    const el = sectionRef.current
    if (!el) return
    let raf = 0

    const compute = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight
        const start = vh * 1.2
        const end = -rect.height * 0.5
        const raw = (start - rect.top) / (start - end || 1)
        setP(Math.min(Math.max(raw, 0), 1))
        // Si el usuario scrollea, dejamos que el botón activo se
        // vuelva a calcular desde la posición del scroll.
        setActiveIndexFromButton(null)
      })
    }

    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    compute()
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  // FORZAMOS las 4 URLs exactas que me diste. Ignoramos completamente
  // lo que venga en data, porque el JSON de property.diaNoche tiene
  // las imágenes mezcladas y eso está causando el bug visual.
  // Imágenes por estación: cada botón muestra la suya
  const IMG_AMANECER  = 'https://larumstudio.com/wp-content/uploads/2026/05/amanecer.webp'
  const IMG_MEDIODIA  = 'https://larumstudio.com/wp-content/uploads/2026/04/unnamed.webp'
  const IMG_ATARDECER = 'https://larumstudio.com/wp-content/uploads/2026/05/atardecer.webp'
  const IMG_NOCHE     = 'https://larumstudio.com/wp-content/uploads/2026/05/noche.webp'

  const dataFull = {
    ...data,
    imagenAmanecer:  IMG_AMANECER,
    imagenDia:       IMG_MEDIODIA,
    imagenAtardecer: IMG_ATARDECER,
    imagenNoche:     IMG_NOCHE,
  }
  const hasAllFour = !!(dataFull.imagenAmanecer && dataFull.imagenDia && dataFull.imagenAtardecer && dataFull.imagenNoche)

  if (!hasAllFour) {
    if (!data?.imagenDia || !data?.imagenNoche) return null

    const lightFallback = lightAt(progress)
    const easedFallback = progress
    const hourFallback = (() => {
      const total = 6 * 60 + 42 + easedFallback * (20 * 60 + 15 - (6 * 60 + 42))
      const h = Math.floor(total / 60)
      const m = Math.floor(total % 60)
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    })()

    return (
      <section
        ref={sectionRef}
        className={extraStyles.dnSection}
        style={{ '--dn-accent': lightFallback.accent } as React.CSSProperties}
      >
        <div className={extraStyles.dnInner}>
          <div className={extraStyles.dnHeader}>
            <h2 className={extraStyles.dnTitle}>
              {data.titulo || t.secciones.diaYNoche}
            </h2>
            {data.descripcion && (
              <p className={extraStyles.dnDesc}>{data.descripcion}</p>
            )}
          </div>
          {reduced ? (
            <div className={extraStyles.dnStatic}>
              <figure>
                <img src={dataFull.imagenDia} alt={t.a11y.diaAlt} loading="lazy" />
                <figcaption>06:00</figcaption>
              </figure>
              <figure>
                <img src={dataFull.imagenNoche} alt={t.a11y.nocheAlt} loading="lazy" />
                <figcaption>20:30</figcaption>
              </figure>
            </div>
          ) : (
            <div className={extraStyles.dnStage}>
              <div className={extraStyles.dnClockTop} aria-hidden="true">
                <span className={extraStyles.dnClockTime}>
                  {formatTime(hourFallback, lang)}
                </span>
              </div>
              <img
                className={extraStyles.dnLayerDay}
                src={dataFull.imagenDia}
                alt={t.a11y.diaAlt}
                loading="eager"
              />
              <img
                className={extraStyles.dnLayerDay}
                src={dataFull.imagenNoche}
                alt={t.a11y.nocheAlt}
                loading="lazy"
                style={{ opacity: easedFallback }}
              />
              <div
                className={extraStyles.dnTint}
                style={{ background: lightFallback.tint }}
                aria-hidden="true"
              />
              <div className={extraStyles.dnClock} aria-hidden="true">
                <span className={extraStyles.dnClockTime}>
                  {formatTime(hourFallback, lang)}
                </span>
                <span className={extraStyles.dnClockTrack}>
                  <span
                    className={extraStyles.dnClockFill}
                    style={{ width: `${easedFallback * 100}%` }}
                  />
                </span>
              </div>
            </div>
          )}
        </div>
      </section>
    )
  }

  const light = lightAt(progress)
  // El activeIndex manda: si el usuario clickeó un botón, ese manda.
  // Si no, se calcula desde la posición del scroll.
  const activeIndex = activeIndexFromButton !== null
    ? activeIndexFromButton
    : (() => {
        for (let i = 0; i < STATIONS.length; i++) {
          const s = STATIONS[i]
          if (progress >= s.pos - 0.17 && progress <= s.pos + 0.17) return i
        }
        return 1 // mediodía por defecto
      })()
  const hour = currentHour(progress)
  const hourStr = `${String(hour.h).padStart(2, '0')}:${String(hour.m).padStart(2, '0')}`

  return (
    <section
      ref={sectionRef}
      className={extraStyles.dnSection}
      style={{ '--dn-accent': light.accent } as React.CSSProperties}
    >
      <div className={extraStyles.dnInner}>
        <div className={extraStyles.dnHeader}>
          <h2 className={extraStyles.dnTitle}>
            {data.titulo || t.secciones.diaYNoche}
          </h2>
          {data.descripcion && (
            <p className={extraStyles.dnDesc}>{data.descripcion}</p>
          )}
        </div>

        {reduced ? (
          <div className={extraStyles.dnStatic}>
            <figure>
              <img src={dataFull.imagenAmanecer} alt={t.a11y.diaAlt} loading="lazy" />
              <figcaption>06:00</figcaption>
            </figure>
            <figure>
              <img src={dataFull.imagenDia} alt={t.a11y.diaAlt} loading="lazy" />
              <figcaption>12:00</figcaption>
            </figure>
            <figure>
              <img src={dataFull.imagenAtardecer} alt={t.a11y.nocheAlt} loading="lazy" />
              <figcaption>18:30</figcaption>
            </figure>
            <figure>
              <img src={dataFull.imagenNoche} alt={t.a11y.nocheAlt} loading="lazy" />
              <figcaption>20:30</figcaption>
            </figure>
          </div>
        ) : (
          <div className={extraStyles.dnStage}>
            <div className={extraStyles.dnClockTop} aria-hidden="true">
              <span className={extraStyles.dnClockTime}>
                {formatTime(hourStr, lang)}
              </span>
            </div>

            <img
              className={extraStyles.dnLayerDay}
              src={[IMG_AMANECER, IMG_MEDIODIA, IMG_ATARDECER, IMG_NOCHE][activeIndex]}
              alt={['Amanecer', 'Mediodía', 'Atardecer', 'Noche'][activeIndex]}
              loading="eager"
            />

            <div
              className={extraStyles.dnTint}
              style={{ background: light.tint }}
              aria-hidden="true"
            />

            <div className={extraStyles.dnStationLabel} aria-hidden="true">
              <span className={extraStyles.dnStationName}>
                {STATIONS[activeIndex].label[lang]}
              </span>
            </div>

            <div className={extraStyles.dnClock} aria-hidden="true">
              <span className={extraStyles.dnClockTime}>
                {formatTime(hourStr, lang)}
              </span>
              <span className={extraStyles.dnClockTrack}>
                <span
                  className={extraStyles.dnClockFill}
                  style={{ width: `${progress * 100}%` }}
                />
              </span>
            </div>
          </div>
        )}

        {!reduced && (
          <div className={extraStyles.dnStationsRow} role="tablist">
            {STATIONS.map((s, i) => {
              const isActive = progress >= s.pos - 0.17 && progress <= s.pos + 0.17
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={
                    isActive
                      ? `${extraStyles.dnStationPill} ${extraStyles.dnStationPillActive}`
                      : extraStyles.dnStationPill
                  }
                  onClick={() => {
                    setPSlider(s.pos)
                    setUserInteracted(true)
                    setActiveIndexFromButton(i)  // ← guarda el index del botón clickeado
                  }}
                >
                  <span className={extraStyles.dnStationPillLabel}>
                    {s.label[lang]}
                  </span>
                  <span className={extraStyles.dnStationPillHour}>
                    {String(s.hour.h).padStart(2, '0')}:{String(s.hour.m).padStart(2, '0')}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
