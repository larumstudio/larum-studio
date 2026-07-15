'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import styles from '../page.module.css'
import extraStyles from './improvements.module.css'
import CalculatorModal, { type CalculatorType } from './calculators/CalculatorModal'

/* =================== HOOKS BASE + FASE 2 =================== */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        obs.disconnect()
      }
    }, { threshold, rootMargin: '0px 0px -60px 0px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible, className: visible ? `${styles.reveal} ${styles.revealVisible}` : styles.reveal }
}

function useParallax(speed = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const img = el.querySelector('img, video') as HTMLElement | null
    if (!img) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight
        if (rect.bottom < 0 || rect.top > vh) return
        // #14 Parallax sutil cinematográfico - imagen se mueve más lento
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh
        const y = progress * speed * 120
        img.style.transform = `translate3d(0, ${y}px, 0) scale(1.18)`
        img.style.willChange = 'transform'
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [speed])
  return ref
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      const current = window.scrollY
      setProgress(total > 0 ? (current / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return progress
}

// #16 Contador animado - hook base
function useCountUp(end: number, active: boolean, duration = 1600) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf = 0
    const start = performance.now()
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
    const tick = (now: number) => {
      const elapsed = now - start
      const p = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(p)
      setCount(Math.floor(eased * end))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setCount(end)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [end, active, duration])
  return count
}

// Helper para parsear stats: "3.900 m²" -> 3900 + " m²"
function parseStat(value: string) {
  const raw = (value || '').trim()
  // separa número y sufijo
  const match = raw.match(/^([\d.,]+)\s*(.*)$/)
  if (!match) return { num: 0, suffix: raw, isNum: false }
  let numStr = match[1]
  const suffix = match[2] || ''
  // Si tiene punto como separador de miles: "3.900" -> 3900
  // Si tiene más de un separador, asumimos miles
  if (numStr.includes('.') && !numStr.includes(',')) {
    // si solo tiene punto y longitud >3 después del punto, es miles
    const parts = numStr.split('.')
    if (parts.length === 2 && parts[1].length === 3) {
      numStr = parts.join('')
    }
  }
  numStr = numStr.replace(/\./g, '').replace(',', '.')
  const num = parseFloat(numStr)
  return { num: isNaN(num) ? 0 : num, suffix, isNum: !isNaN(num) }
}

function CountUpStat({ value, label, index }: { value: string; label: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const { num, suffix, isNum } = parseStat(value)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        // #15 Fade-in escalonado 100-150ms entre cada número
        setTimeout(() => setActive(true), index * 130)
        obs.disconnect()
      }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [index])

  const count = useCountUp(num, active, 1400 + index * 120)

  // Formateo cinematográfico
  const formatted =
    !isNum ? value : active && count < num
      ? suffix.includes('m²') || num >= 100
        ? `${new Intl.NumberFormat('es-PY').format(count)}${suffix ? ` ${suffix}` : ''}`
        : `${count}${suffix ? ` ${suffix}` : ''}`
      : value // al final muestra valor original exacto para no romper "3.900 m²" vs "3,900"

  return (
    <div
      ref={ref}
      className={`${styles.statsRowItem} ${extraStyles.statItemAnimated} ${active ? extraStyles.statItemVisible : ''}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={`${styles.statsRowValue} ${extraStyles.statValueCount}`}>{formatted}</div>
      <div className={styles.statsRowLabel}>{label}</div>
    </div>
  )
}

// #18 Transición texto hero palabra por palabra
function HeroHeadlineReveal({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <h1 className={`${styles.heroCenteredTitle} ${extraStyles.heroTitleReveal}`}>
      {words.map((w, i) => (
        <span key={i} className={extraStyles.heroWordWrap}>
          <span className={extraStyles.heroWord} style={{ animationDelay: `${0.45 + i * 0.09}s` }}>
            {w}&nbsp;
          </span>
        </span>
      ))}
    </h1>
  )
}

/* =================== MEJORAS FASE 1 (se mantienen) =================== */
function ScrollProgressBar() {
  const progress = useScrollProgress()
  return (
    <div className={extraStyles.scrollProgressTrack}>
      <div className={extraStyles.scrollProgressBar} style={{ width: `${progress}%` }} />
    </div>
  )
}

function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (!show) return null
  return (
    <button className={extraStyles.backToTop} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Volver arriba">
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.3}><path d="M12 19V5M5 12l7-7 7 7"/></svg>
    </button>
  )
}

function FullBleedBreak({ src, caption }: { src: string; caption?: string }) {
  const ref = useParallax(0.18)
  const reveal = useReveal()
  return (
    <section ref={reveal.ref as any} className={`${reveal.className} ${styles.fullBleed}`}>
      <div ref={ref} className={styles.fullBleedImgWrap}>
        <img loading="lazy" src={src} alt={caption || ''} />
      </div>
      <div className={styles.fullBleedOverlay} />
      {caption && <p className={styles.fullBleedCaption}>{caption}</p>}
    </section>
  )
}

const IconArrow = () => <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13,6 19,12 13,18" /></svg>
const IconMail = () => <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
const IconInstagram = () => <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
const IconWhatsapp = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
const IconMenu = () => <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></svg>
const IconClose = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
const IconCheck = () => <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><polyline points="20,6 9,17 4,12" /></svg>
const IconDownload = () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7,10 12,15 17,10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
const IconLinkedin = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
const IconCalendar = () => <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>

function GalleryLightbox({ images, startIndex, onClose }: { images: any[]; startIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(startIndex)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const goPrev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length])
  const goNext = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length])
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, goPrev, goNext])
  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX)
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const diff = e.changedTouches[0].clientX - touchStart
    if (Math.abs(diff) > 50) { if (diff > 0) goPrev(); else goNext() }
    setTouchStart(null)
  }
  const current = images[index]
  return (
    <div className={extraStyles.lightboxOverlay} onClick={onClose} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className={extraStyles.lightboxTopBar} onClick={e => e.stopPropagation()}>
        <div className={extraStyles.lightboxCounter}>
          <span className={extraStyles.lightboxCounterCurrent}>{String(index + 1).padStart(2, '0')}</span>
          <span className={extraStyles.lightboxCounterSep}> / </span>
          <span className={extraStyles.lightboxCounterTotal}>{String(images.length).padStart(2, '0')}</span>
        </div>
        <button className={extraStyles.lightboxCloseBtn} onClick={onClose}><IconClose /></button>
      </div>
      <button className={`${extraStyles.lightboxNav} ${extraStyles.lightboxPrev}`} onClick={e => { e.stopPropagation(); goPrev() }}><svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M15 18l-6-6 6-6" /></svg></button>
      <button className={`${extraStyles.lightboxNav} ${extraStyles.lightboxNext}`} onClick={e => { e.stopPropagation(); goNext() }}><svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M9 18l6-6-6-6" /></svg></button>
      <div className={extraStyles.lightboxMain} onClick={e => e.stopPropagation()}>
        {current?.isVideo ? <video src={current.url} autoPlay muted loop playsInline controls className={extraStyles.lightboxImg} /> : <img src={current?.url} alt={current?.caption || ''} className={extraStyles.lightboxImg} />}
        {current?.caption && <div className={extraStyles.lightboxCaptionWrap}><p className={extraStyles.lightboxCaptionText}>{current.caption}</p></div>}
      </div>
      <div className={extraStyles.lightboxThumbs} onClick={e => e.stopPropagation()}>
        {images.map((img: any, i: number) => (
          <button key={i} className={`${extraStyles.lightboxThumb} ${i === index ? extraStyles.lightboxThumbActive : ''}`} onClick={() => setIndex(i)}>
            {img.isVideo ? <video src={img.url} muted /> : <img src={img.url} alt="" />}
          </button>
        ))}
      </div>
    </div>
  )
}

const amenityIcons: Record<string, React.ReactNode> = {
  'PISCINA INFINITY': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M2 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M2 19c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><rect x="4" y="4" width="16" height="10" rx="3"/></svg>,
  'GIMNASIO PRIVADO': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M6.5 6.5h-2a1 1 0 00-1 1v9a1 1 0 001 1h2M17.5 6.5h2a1 1 0 011 1v9a1 1 0 01-1 1h-2M6.5 12h11M6.5 6.5v11M17.5 6.5v11"/></svg>,
  'JARDÍN EXTERIOR': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M12 22V12"/><path d="M8 12c0-3 2-5 4-6 2 1 4 3 4 6"/><path d="M5 16c0-2.5 2-4.5 4-5"/><path d="M19 16c0-2.5-2-4.5-4-5"/><path d="M2 22h20"/></svg>,
  'TERRAZA PRIVADA': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M4 22h16"/><path d="M9 22v-5h6v5"/></svg>,
  'JACUZZI INTERIOR': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><ellipse cx="12" cy="15" rx="8" ry="3.5"/><path d="M4 15v2.5c0 2 3.6 3.5 8 3.5s8-1.5 8-3.5V15"/><path d="M8 8c0-1.5.7-3 2-3s2 1.5 2 3"/><path d="M13 8c0-1.5.7-3 2-3s2 1.5 2 3"/></svg>,
  'COCINA GOURMET': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M12 2v4M8 2v2M16 2v2"/><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M3 14h18"/><circle cx="8" cy="18" r="1"/><circle cx="16" cy="18" r="1"/></svg>,
  'ESTACIONAMIENTO': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 010 6H9"/></svg>,
  'SEGURIDAD 24H': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
  'VISTA PANORÁMICA': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><circle cx="12" cy="12" r="3"/><path d="M2 12c2.5-4 6-7 10-7s7.5 3 10 7c-2.5 4-6 7-10 7s-7.5-3-10-7z"/></svg>,
  'DEFAULT': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="9"/></svg>
}
function categorizeAmenity(label: string): 'bienestar' | 'exterior' | 'servicios' {
  const l = label.toUpperCase()
  if (/PISCINA|JACUZZI|GIMNASIO|SPA|SAUNA|MASAJE|YOGA|CINE|THEATER|GYM|WELLNESS/i.test(l)) return 'bienestar'
  if (/JARDIN|TERRAZA|VISTA|MUELLE|PLAYA|CANCHA|GOLF|JARDÍN|EXTERIOR|QUINCHO|PARRILLA/i.test(l)) return 'exterior'
  return 'servicios'
}
function AmenitiesGrouped({ amenities }: { amenities: string[] }) {
  const [active, setActive] = useState<'bienestar' | 'exterior' | 'servicios'>('bienestar')
  const grouped = {
    bienestar: amenities.filter(a => categorizeAmenity(a) === 'bienestar'),
    exterior: amenities.filter(a => categorizeAmenity(a) === 'exterior'),
    servicios: amenities.filter(a => categorizeAmenity(a) === 'servicios'),
  }
  if (grouped.bienestar.length === 0 && grouped.exterior.length === 0) {
    grouped.bienestar = amenities.slice(0, 3)
    grouped.exterior = amenities.slice(3, 6)
    grouped.servicios = amenities.slice(6)
  }
  const categories = [
    { key: 'bienestar' as const, label: 'Bienestar', count: grouped.bienestar.length, desc: 'Piscina, jacuzzi, gimnasio y descanso' },
    { key: 'exterior' as const, label: 'Exterior', count: grouped.exterior.length, desc: 'Jardín, terraza, vistas y entorno' },
    { key: 'servicios' as const, label: 'Servicios', count: grouped.servicios.length, desc: 'Seguridad, parking, cocina gourmet' },
  ]
  return (
    <div className={extraStyles.amenitiesGrouped}>
      <div className={extraStyles.amenitiesTabs}>
        {categories.map(cat => (
          <button key={cat.key} className={`${extraStyles.amenityTab} ${active === cat.key ? extraStyles.amenityTabActive : ''}`} onClick={() => setActive(cat.key)}>
            <span className={extraStyles.amenityTabLabel}>{cat.label}</span>
            <span className={extraStyles.amenityTabCount}>{String(cat.count).padStart(2, '0')}</span>
            <span className={extraStyles.amenityTabDesc}>{cat.desc}</span>
          </button>
        ))}
      </div>
      <div className={extraStyles.amenitiesTabContent}>
        <div className={extraStyles.amenitiesIconsGrid}>
          {grouped[active].map((label, i) => (
            <div key={`${active}-${i}`} className={extraStyles.amenityCard} style={{ animationDelay: `${i * 80}ms` }}>
              <div className={extraStyles.amenityCardIcon}>{amenityIcons[label] || amenityIcons['DEFAULT']}</div>
              <span className={extraStyles.amenityCardLabel}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DocumentationCards({ docs }: { docs: any[] }) {
  const getMeta = (doc: any) => {
    const titulo = (doc.titulo || '').toLowerCase()
    if (titulo.includes('plano')) return { color: '#c9a96e', preview: '⌖', hasThumb: true }
    if (titulo.includes('certific')) return { color: '#7a8a6a', preview: '◈', hasThumb: true }
    if (titulo.includes('ficha')) return { color: '#8a7a6a', preview: '⬙', hasThumb: true }
    if (titulo.includes('qr')) return { color: '#111', preview: 'QR', hasThumb: false }
    return { color: '#c9a96e', preview: 'PDF', hasThumb: true }
  }
  return (
    <div className={extraStyles.docCardsGrid}>
      {docs.map((d: any, i: number) => {
        const meta = getMeta(d)
        return (
          <a key={i} href={d.url} target="_blank" rel="noopener" className={extraStyles.docCard}>
            <div className={extraStyles.docCardPreview} style={{ borderColor: meta.color, overflow: 'hidden', position: 'relative' }}>
              {d.thumbnailUrl && !d.thumbnailUrl.endsWith('.pdf') ? (
                <img src={d.thumbnailUrl} alt={d.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
              ) : meta.preview === 'QR' && d.url && d.url.match(/\.(png|jpg|webp)/) ? (
                <img src={d.url} alt="QR" style={{ width: '70%', height: '70%', objectFit: 'contain', margin: 'auto' }} />
              ) : (
                <>
                  <span className={extraStyles.docCardPreviewIcon} style={{ color: meta.color, fontSize: meta.preview.length <= 2 ? '1.8rem' : '1rem' }}>{meta.preview}</span>
                  <span style={{ position: 'absolute', bottom: '6px', left: '8px', fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.1em', color: meta.color, opacity: 0.6 }}>PDF</span>
                </>
              )}
              <span className={extraStyles.docCardNumber} style={{ position: 'relative', zIndex: 1 }}>{String(i + 1).padStart(2, '0')}</span>
            </div>
            <div className={extraStyles.docCardInfo}>
              <h4 className={extraStyles.docCardTitle}>{d.titulo}</h4>
              {d.detalle && <p className={extraStyles.docCardDetail}>{d.detalle}</p>}
              <span className={extraStyles.docCardAction}>Ver documento <IconArrow /></span>
            </div>
            <div className={extraStyles.docCardHoverIcon}><IconDownload /></div>
          </a>
        )
      })}
    </div>
  )
}


/* =================== FASE 3 - CONTENIDO PREMIUM =================== */
function UnDiaEnCasa({ data }: { data: any[] }) {
  if (!data || !data.length) return null
  return (
    <RevealSection className={extraStyles.unDiaSection}>
      <div className={extraStyles.unDiaInner}>
        <div className={extraStyles.unDiaHeader}>
          <p className={styles.eyebrow}>Un día en esta casa</p>
          <h2 className={extraStyles.unDiaTitle}>No se visita. Se habita.</h2>
          <p className={extraStyles.unDiaIntro}>De la primera luz del lago al último brindis en la terraza, así transcurre un día donde el tiempo deja de empujar.</p>
        </div>
        <div className={extraStyles.unDiaTimeline}>
          {data.map((item: any, i: number) => (
            <div key={i} className={extraStyles.unDiaItem} style={{ animationDelay: `${i * 120}ms` }}>
              <div className={extraStyles.unDiaTimeWrap}>
                <span className={extraStyles.unDiaTime}>{item.hora}</span>
                <span className={extraStyles.unDiaDot} />
                <span className={extraStyles.unDiaLine} />
              </div>
              <div className={extraStyles.unDiaContent}>
                <h4 className={extraStyles.unDiaItemTitle}>{item.titulo}</h4>
                <p className={extraStyles.unDiaItemDesc}>{item.desc}</p>
              </div>
              {item.imagen && (
                <div className={extraStyles.unDiaImg}>
                  <img loading="lazy" src={item.imagen} alt={item.titulo} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  )
}

function TestimonioPropietario({ data }: { data: any }) {
  if (!data) return null
  return (
    <RevealSection className={extraStyles.testimonioSection}>
      <div className={extraStyles.testimonioInner}>
        <div className={extraStyles.testimonioQuoteMark}>“</div>
        <blockquote className={extraStyles.testimonioFrase}>{data.frase}</blockquote>
        <div className={extraStyles.testimonioMeta}>
          <span className={extraStyles.testimonioAutor}>{data.autor}</span>
          {data.contexto && <span className={extraStyles.testimonioContexto}>{data.contexto}</span>}
        </div>
      </div>
    </RevealSection>
  )
}

function DiaNocheSlider({ data }: { data: any }) {
  const [pos, setPos] = useState(50)
  const ref = useRef<HTMLDivElement>(null)
  if (!data) return null
  const onMove = (e: any) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const x = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.max(5, Math.min(95, x)))
  }
  return (
    <RevealSection className={extraStyles.diaNocheSection}>
      <div className={extraStyles.diaNocheInner}>
        <div className={extraStyles.diaNocheHeader}>
          <p className={styles.eyebrow}>Transición real</p>
          <h2 className={extraStyles.diaNocheTitle}>{data.titulo || 'Día y noche, misma toma'}</h2>
          <p className={extraStyles.diaNocheDesc}>{data.descripcion}</p>
        </div>
        <div ref={ref} className={extraStyles.diaNocheSlider} onMouseMove={onMove} onTouchMove={onMove} onMouseDown={onMove}>
          <img src={data.imagenNoche} alt="Noche" className={extraStyles.diaNocheImgBack} />
          <div className={extraStyles.diaNocheImgFrontWrap} style={{ width: `${pos}%` }}>
            <img src={data.imagenDia} alt="Día" className={extraStyles.diaNocheImgFront} />
          </div>
          <div className={extraStyles.diaNocheHandle} style={{ left: `${pos}%` }}>
            <div className={extraStyles.diaNocheHandleLine} />
            <div className={extraStyles.diaNocheHandleCircle}>↔</div>
          </div>
          <span className={`${extraStyles.diaNocheLabel} ${extraStyles.diaNocheLabelDia}`}>06:42 AM</span>
          <span className={`${extraStyles.diaNocheLabel} ${extraStyles.diaNocheLabelNoche}`}>20:15 PM</span>
        </div>
      </div>
    </RevealSection>
  )
}

function InversionSection({ data }: { data: any }) {
  if (!data) return null
  return (
    <RevealSection className={extraStyles.inversionSection}>
      <div className={extraStyles.inversionInner}>
        <div className={extraStyles.inversionHeader}>
          <p className={styles.eyebrow}>{data.eyebrow || 'Inversión'}</p>
          <h2 className={extraStyles.inversionTitle}>{data.titulo}</h2>
          <p className={extraStyles.inversionDesc}>{data.descripcion}</p>
        </div>
        <div className={extraStyles.inversionGrid}>
          {data.datos?.map((d: any, i: number) => (
            <div key={i} className={extraStyles.inversionCard} style={{ animationDelay: `${i*100}ms` }}>
              <span className={extraStyles.inversionLabel}>{d.label}</span>
              <span className={extraStyles.inversionValor}>{d.valor}</span>
              <span className={extraStyles.inversionTendencia}>{d.tendencia}</span>
            </div>
          ))}
        </div>
        {data.plusvalia && <div className={extraStyles.inversionPlusvalia}>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{data.plusvalia.titulo}</h4>
          <p style={{ opacity: 0.7, lineHeight: 1.6 }}>{data.plusvalia.descripcion}</p>
        </div>}
        {data.fuente && <p className={extraStyles.inversionFuente}>Fuente: {data.fuente}</p>}
      </div>
    </RevealSection>
  )
}

function FAQSection({ items }: { items: any[] }) {
  const [open, setOpen] = useState<number | null>(null)
  if (!items || !items.length) return null
  return (
    <RevealSection className={extraStyles.faqSection}>
      <div className={extraStyles.faqInner}>
        <div className={extraStyles.faqHeader}>
          <p className={styles.eyebrow}>Preguntas frecuentes</p>
          <h2 className={extraStyles.faqTitle}>Objeciones resueltas antes de la visita.</h2>
          <p className={extraStyles.faqIntro}>Respondemos lo que otros dejan para después. Transparencia elegante.</p>
        </div>
        <div className={extraStyles.faqList}>
          {items.map((it: any, i: number) => (
            <div key={i} className={`${extraStyles.faqItem} ${open===i ? extraStyles.faqItemOpen : ''}`}>
              <button className={extraStyles.faqQuestion} onClick={() => setOpen(open===i? null : i)}>
                <span>{it.pregunta}</span>
                <span className={extraStyles.faqIcon}>{open===i? '—' : '+'}</span>
              </button>
              <div className={extraStyles.faqAnswerWrap} style={{ maxHeight: open===i? '500px' : '0' }}>
                <p className={extraStyles.faqAnswer}>{it.respuesta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  )
}

function LoQueNoSeVeSection({ data }: { data: any[] }) {
  if (!data || !data.length) return null
  return (
    <RevealSection className={extraStyles.loQueNoSeVeSection}>
      <div className={extraStyles.loQueNoSeVeInner}>
        <div className={extraStyles.loQueNoSeVeHeader}>
          <p className={styles.eyebrow}>Lo que no se ve</p>
          <h2 className={extraStyles.loQueNoSeVeTitle}>El valor está en lo invisible.</h2>
          <p className={extraStyles.loQueNoSeVeIntro}>Los compradores de lujo valoran lo que sostiene la experiencia todos los días, sin fallar. Seguridad, eficiencia, materiales y autonomía.</p>
        </div>
        <div className={extraStyles.loQueNoSeVeGrid}>
          {data.map((cat: any, i: number) => (
            <div key={i} className={extraStyles.loQueNoSeVeCard}>
              <h4 className={extraStyles.loQueNoSeVeCat}>{cat.categoria}</h4>
              <ul className={extraStyles.loQueNoSeVeList}>
                {cat.items.map((it: string, j: number) => (
                  <li key={j}><span className={extraStyles.loCheck}><IconCheck /></span><span>{it}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  )
}

const landmarkIcons: Record<string, React.ReactNode> = {
  playa: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M2 20h20M5 20c0-4 3-7 7-7s7 3 7 7"/><path d="M12 13V3M9 6l3-3 3 3"/></svg>,
  otro: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M12 22s8-7 8-12a8 8 0 10-16 0c0 5 8 12 8 12z"/><circle cx="12" cy="10" r="3"/></svg>,
}
const gastoIcons: Record<string, React.ReactNode> = {
  otro: <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
}
function normalizeLandmarkKey(raw: string) { return (raw || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim() }
function getLandmarkName(lm: any) { return lm.nombre || lm.name || lm.label || '' }
function getLandmarkIcon(lm: any) {
  const rawIcon = lm.icono || lm.icon || lm.type || lm.label || ''
  const key = normalizeLandmarkKey(rawIcon)
  return landmarkIcons[key] || landmarkIcons['otro']
}
function getLandmarkDetail(lm: any) { return lm.detalle || '' }
function getLandmarkMinutes(lm: any) { return lm.minutos || lm.min || '' }

const navLinks = [
  { href: '#residencia', label: 'Residencia' },
  { href: '#galeria', label: 'Galería' },
  { href: '#amenities', label: 'Amenities' },
  { href: '#entorno', label: 'Entorno' },
  { href: '#ubicacion', label: 'Ubicación' },
  { href: '#contacto', label: 'Contacto' },
]
const featureIconByName: Record<string, React.ReactNode> = {
  'Hoja': <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>,
  'Escudo': <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  'Casa': <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M9 22V12h6v10"/></svg>,
  'Ubicacion': <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M12 22s8-7 8-12a8 8 0 10-16 0c0 5 8 12 8 12z"/><circle cx="12" cy="10" r="3"/></svg>,
  'Llave': <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><circle cx="8" cy="8" r="5"/><path d="M11.5 11.5L21 21M16 16l3-3M19 19l2-2"/></svg>,
  'Diamante': <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M12 3L8 9l4 12 4-12z"/></svg>,
}
const featureIcons: React.ReactNode[] = Object.values(featureIconByName)

function PageLoader() {
  const [loaded, setLoaded] = useState(false)
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    const t1 = setTimeout(() => setLoaded(true), 800)
    const t2 = setTimeout(() => setHidden(true), 1500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])
  if (hidden) return null
  return (
    <div className={`${styles.pageLoader} ${loaded ? styles.pageLoaderExit : ''}`}>
      <div className={styles.pageLoaderLogo}>LARUM</div>
      <div className={styles.pageLoaderBar}><div className={styles.pageLoaderBarFill} /></div>
    </div>
  )
}
function RevealSection({ children, className = '', as = 'section', id, style }: { children: React.ReactNode; className?: string; as?: 'section' | 'div' | 'footer'; id?: string; style?: React.CSSProperties }) {
  const reveal = useReveal()
  const Tag = as as any
  return <Tag ref={reveal.ref as any} className={`${reveal.className} ${styles.stagger} ${className}`} id={id} style={style}>{children}</Tag>
}

function BrochureForm({ agentEmail, compact, privacidadTexto, privacidadUrl, brochureUrl }: { agentEmail: string, compact?: boolean, privacidadTexto?: string, privacidadUrl?: string, brochureUrl?: string }) {
  const [submitted, setSubmitted] = useState(false)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [loading, setLoading] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const canSubmit = whatsapp.trim() !== '' && email.trim() !== '' && accepted
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('nombre', nombre || '—')
      fd.append('email', email || '—')
      fd.append('whatsapp', whatsapp)
      fd.append('_subject', 'Solicitud Memoria')
      fd.append('_captcha', 'false')
      fd.append('_template', 'table')
      await fetch(`https://formsubmit.co/${agentEmail}`, { method: 'POST', body: fd })
    } catch {}
    setLoading(false)
    setSubmitted(true)
  }
  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 2rem', background: '#1a1714', borderRadius: '6px' }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: '#fff', marginBottom: '0.75rem' }}>Solicitud recibida.</p>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>Te contactamos en las próximas horas con la memoria completa.</p>
        {brochureUrl && <button type="button" className={styles.memoriaBtn} style={{ display: 'inline-flex', gap: '0.5rem', cursor: 'pointer', border: 'none' }} onClick={() => {
          const iframe = document.createElement('iframe')
          iframe.style.display = 'none'
          iframe.src = brochureUrl
          document.body.appendChild(iframe)
          const link = document.createElement('a')
          link.href = brochureUrl
          link.download = 'Brochure-Villa-San-Bernardino.pdf'
          link.target = '_blank'
          link.rel = 'noopener'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }}><IconDownload /> Descargar Brochure</button>}
      </div>
    )
  }
  return (
    <form className={compact ? styles.memoriaFormCompact : styles.memoriaFormWrap} onSubmit={handleSubmit}>
      <div className={styles.memoriaFormRow}>
        <div className={styles.formField}><input className={styles.formInput} type="text" placeholder="NOMBRE" value={nombre} onChange={e => setNombre(e.target.value)} /></div>
        <div className={styles.formField}><input className={styles.formInput} type="tel" placeholder="WHATSAPP *" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} /></div>
      </div>
      <div className={styles.formField}><input className={styles.formInput} type="email" placeholder="EMAIL *" required value={email} onChange={e => setEmail(e.target.value)} /></div>
      <div className={styles.privacidadWrap}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
        <input type="checkbox" className={styles.privacidadCheck} id="privacidad-brochure" style={{ marginTop: '3px' }} checked={accepted} onChange={e => setAccepted(e.target.checked)} required />
        <label htmlFor="privacidad-brochure" className={styles.privacidadLabel} style={{ margin: 0 }}>
          {privacidadUrl ? <>{(privacidadTexto || 'Acepto la ').replace('política de privacidad', '').trim()} <a href={privacidadUrl} target="_blank" rel="noopener">política de privacidad</a></> : (privacidadTexto || 'Acepto la política de privacidad')}
        </label>
        </div>
      </div>
      <button type="submit" className={styles.memoriaBtn} disabled={loading || !canSubmit} style={{ opacity: canSubmit ? 1 : 0.45 }}>
        {loading ? 'Enviando…' : <><IconDownload /> Descargar Brochure de la Propiedad</>}
      </button>
    </form>
  )
}

function AnalyticsScripts({ ga4Id, metaPixelId }: { ga4Id?: string; metaPixelId?: string }) {
  if (!ga4Id && !metaPixelId) return null
  return (
    <>
      {ga4Id && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} />
          <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');` }} />
        </>
      )}
      {metaPixelId && (
        <script dangerouslySetInnerHTML={{ __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');` }} />
      )}
    </>
  )
}

export default function PropertyPage({ data }: { data: any }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [lightboxState, setLightboxState] = useState<{ images: any[]; index: number } | null>(null)
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', fecha: '' })
  const [calculatorOpen, setCalculatorOpen] = useState<CalculatorType | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { property, agent } = data
  const waMensaje = encodeURIComponent(`Hola, vi la propiedad ${property.name} y quiero más información`)
  const whatsappUrl = agent.whatsapp ? `https://wa.me/${agent.whatsapp}?text=${waMensaje}` : '#'
  const allGallery = property.gallery || []

  return (
    <div className={styles.page}>
      <ScrollProgressBar />
      <BackToTop />
      {calculatorOpen && <CalculatorModal type={calculatorOpen} onClose={() => setCalculatorOpen(null)} defaultPrice={property?.price} />}
      {lightboxState && <GalleryLightbox images={lightboxState.images} startIndex={lightboxState.index} onClose={() => setLightboxState(null)} />}
      <PageLoader />

      <nav className={`${styles.navbar} ${extraStyles.navbarImproved} ${scrolled ? styles.navbarScrolled : ''} ${scrolled ? extraStyles.navbarScrolledImproved : ''}`}>
        <div className={styles.navInner}>
          <a href="#residencia" className={styles.navLogo}>{property.footerTitulo || 'LARUM STUDIO'}</a>
          <div className={styles.navLinks}>{navLinks.map(l => <a key={l.href} href={l.href} className={styles.navLink}>{l.label}</a>)}</div>
          <div className={styles.navRight}>
            <a href={whatsappUrl} className={`${styles.navCta} ${extraStyles.navCtaPulse}`} target="_blank" rel="noopener">Agendar Visita</a>
            <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <IconClose /> : <IconMenu />}</button>
          </div>
        </div>
      </nav>
      {menuOpen && <div className={styles.mobileMenu}>{navLinks.map(l => <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>)}</div>}

      {/* HERO - #18 CINEMATOGRÁFICO */}
      <section id="residencia" className={styles.hero}>
        {property.videoHero ? (
          <video className={styles.heroBgVideo} autoPlay muted loop playsInline poster={property.posterHero} preload="auto" key={property.videoHero}>
            <source src={property.videoHero} type="video/mp4" />
          </video>
        ) : (
          <img src={property.posterHero} alt={property.name} className={styles.heroBgVideo} />
        )}
        <div className={styles.heroGradientTB} />
        <div className={styles.heroGradientCenter} />
        <div className={styles.heroCentered}>
          <p className={`${styles.heroCenteredEyebrow} ${extraStyles.heroEyebrowAnimated}`}>{property.location.city}, {property.location.country}</p>
          <HeroHeadlineReveal text={property.heroHeadline || property.name} />
          {property.precio && (
            <div className={`${styles.heroCenteredPrice} ${extraStyles.heroPriceAnimated}`}>
              <span className={styles.heroCenteredPriceLabel}>PRECIO</span>
              <span className={styles.heroCenteredPriceValue}>{property.precio}</span>
            </div>
          )}
          <div className={`${styles.heroCenteredBtns} ${extraStyles.heroBtnsAnimated}`}>
            <a href={whatsappUrl} target="_blank" rel="noopener" className={`${styles.heroCenteredBtnPrimary} ${extraStyles.ctaGlow}`}>SOLICITAR AGENDA PRIVADA</a>
            {property.brochure && <a href="#memoria" className={styles.heroCenteredBtnSecondary}>DESCARGAR BROCHURE →</a>}
          </div>
          <div className={`${styles.heroScrollHint} ${extraStyles.heroScrollAnimated}`}>
            <span>SCROLL</span><div className={styles.heroScrollLine} />
          </div>
        </div>
      </section>



      {/* STATS - #15 escalonado + #16 contador animado */}
      <section className={styles.statsRow}>
        <div className={styles.statsRowInner}>
          {[
            { value: property.stats.terreno || '3.900 m²', label: 'Terreno' },
            { value: property.stats.construidos || '800 m²', label: 'Construidos' },
            { value: property.stats.dormitorios || '6', label: 'Dormitorios' },
            { value: property.stats.banos || '5', label: 'Baños' },
            { value: property.stats.cocheras || '4', label: 'Aparcamientos' },
            { value: property.stats.ano || '2018', label: 'Año de Construcción' },
          ].map((st, i) => (
            <CountUpStat key={i} value={st.value} label={st.label} index={i} />
          ))}
        </div>
      </section>

      {property.positioning && (
        <RevealSection className={styles.positioning}>
          <div className={styles.posIntro}>
            <div className={styles.posIntroLeft}>
              <div className={styles.posIntroNum}><span>01</span><span className={styles.posIntroLine} /><span className={styles.posIntroLabel}>Porque algunos lugares no se eligen. Se reconocen.</span></div>
              <h2 className={styles.posIntroTitle}>En San Bernardino, las casas frente al lago rara vez se anuncian: se transmiten entre quienes ya pertenecen al lugar.</h2>
              <p className={styles.posIntroItalicLine}>Esta es una de ellas.</p>
            </div>
            <div className={styles.posIntroRight}>
              <p className={styles.posIntroPara}>No fue hecha para ser vista. Fue hecha para ser vivida. Un lugar donde el lago no es paisaje, sino presencia constante.</p>
              <p className={styles.posIntroPara}>Aquí no se viene a descansar de la vida. Se viene a recordarla y conectar con ella.</p>
              <blockquote className={styles.posQuoteBlock}><p>«Las cosas verdaderamente valiosas son aquellas que no están a la venta para cualquiera.»</p></blockquote>
            </div>
          </div>
        </RevealSection>
      )}

      <RevealSection className={styles.story} id="narrativa">
        <div className={styles.storyInner}>
          <div className={styles.storyLeft}>
            <p className={styles.eyebrow}>La Historia</p>
            <h2 className={styles.storyTitle}>Lo que se siente al llegar</h2>
            <p className={styles.storyDesc}>Al cruzar el portón, el mundo se queda afuera. Solo queda el lago, reflejado entre los árboles. Un umbral que muy pocos tienen el privilegio de atravesar.</p>
            <p className={styles.storyDesc} style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>San Bernardino siempre se guardó en silencio. Esta casa forma parte de esa herencia: un lugar pensado no para impresionar, sino para que uno pueda volver a estar.</p>
            <p className={styles.storyDesc} style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>Aquí el amanecer no se celebra. Se vive. El espacio no presiona. Contiene. Y por primera vez en mucho tiempo, no hace falta explicarse.</p>
            <p className={styles.storyDesc} style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>Cruzar ese portón no es llegar a una residencia. Es recordar que todavía existen refugios que no se anuncian.</p>
          </div>
          <div className={styles.storyRight}><div className={styles.storyImgWrap}><img loading="lazy" src={property.story?.image || property.posterHero} alt={property.story?.title || property.name} className={styles.storyImg} /></div></div>
        </div>
      </RevealSection>

      {/* #24 Testimonio propietario - BEFORE Un Día */}
      {property.testimonioPropietario && <TestimonioPropietario data={property.testimonioPropietario} />}

      {/* #23 Un día en esta casa */}
      {property.unDiaEnCasa && <UnDiaEnCasa data={property.unDiaEnCasa} />}

      {/* #29 Comparación día/noche real */}
      {property.diaNoche && <DiaNocheSlider data={property.diaNoche} />}

      {property.videoPresentacion && (
        <RevealSection className={styles.videoFeature} id="video-tour">
          <div className={styles.videoFeatureInner}>
            <div className={styles.videoFeatureHeader}><p className={styles.eyebrow}>Recorrido</p><h2 className={styles.videoFeatureTitle}>Adéntrate en el viaje</h2></div>
            <div className={styles.videoFeatureFrame}>
              <video className={styles.videoFeatureEl} controls poster="https://larumstudio.com/wp-content/uploads/2026/04/unnamed-1.webp" preload="none"><source src={property.videoPresentacion} type="video/mp4" /></video>
              <div className={styles.videoFeatureMeta}><span className={styles.videoFeatureLabel}>Recorrido completo · 4K</span><span className={styles.videoFeatureDur}>{property.videoDuration || '1:19'} min</span></div>
            </div>
            {property.videoMarkers && property.videoMarkers.length > 0 && (
              <div className={styles.videoMarkers}>
                {property.videoMarkers.map((m: any, i: number) => (
                  <div key={i} className={styles.videoMarker}>
                    <span className={styles.videoMarkerTime}>{m.time}</span>
                    <span className={styles.videoMarkerLabel}>{m.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </RevealSection>
      )}

      <RevealSection className={styles.features}>
        <div className={styles.featuresInner}>
          <p className={styles.eyebrow}>Por qué esta casa, y no otra</p>
          <h2 className={styles.sectionTitleH2}>El lugar que eliges cuando ya no buscas más</h2>
          <div className={styles.featuresGrid}>
            {[
              { icono: 'Hoja', title: 'Una piscina infinity que se integra al paisaje', desc: 'El agua parece continuar hasta el lago.' },
              { icono: 'Escudo', title: 'Privacidad verdadera', desc: 'Un entorno que te envuelve y te protege.' },
              { icono: 'Casa', title: 'Libertad dentro de la casa', desc: 'Espacios independientes para cada momento.' },
              { icono: 'Ubicacion', title: 'Dos mundos sin renunciar a ninguno', desc: 'El lago por la tarde. Asunción cuando lo necesitas.' },
              { icono: 'Llave', title: 'Cero obras. Cero esperas.', desc: 'Residencia lista para habitar desde el primer día.' },
              { icono: 'Diamante', title: 'Un enclave que resiste el paso del tiempo', desc: 'San Bernardino no se ha masificado.' },
            ].map((f, i) => (
              <div key={i} className={`${styles.featureItem} ${extraStyles.featureItemReveal}`} style={{ transitionDelay: `${i * 110}ms` }}>
                <div className={styles.featureIcon}>{featureIconByName[f.icono]}</div>
                <h4 className={styles.featureTitle}>{f.title}</h4>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection className={styles.gallerySection} id="galeria">
        <div className={styles.galleryInner}>
          <div className={styles.galleryHeader}><div><p className={styles.eyebrow}>Galería</p><h2 className={styles.galleryTitle}>Momentos para enamorarte</h2><p className={styles.gallerySubtitle}>Una secuencia visual que sigue el recorrido natural de la propiedad.</p></div></div>
          {allGallery.length > 0 && (
            <div className={extraStyles.galleryPreviewLayoutImproved}>
              <div className={`${extraStyles.galleryHeroImgImproved} ${extraStyles.hoverZoom}`} onClick={() => setLightboxState({ images: allGallery, index: 0 })}>
                {allGallery[0].isVideo ? <video src={allGallery[0].url} autoPlay muted loop playsInline /> : <img loading="lazy" src={allGallery[0].url} alt={allGallery[0].caption} />}
                <div className={extraStyles.galleryHeroOverlay}><span>Ver en pantalla completa</span></div>
                <div className={styles.galCaption}>{allGallery[0].caption}</div>
              </div>
              <div className={extraStyles.galleryThumbRowImproved}>
                {allGallery.slice(1, 5).map((img: any, i: number) => (
                  <div key={i} className={`${extraStyles.galleryThumbImproved} ${extraStyles.hoverZoom}`} onClick={() => setLightboxState({ images: allGallery, index: i + 1 })}>
                    {img.isVideo ? <video src={img.url} autoPlay muted loop playsInline /> : <img loading="lazy" src={img.url} alt={img.caption} />}
                  </div>
                ))}
              </div>
              <div className={styles.galleryCta}><button className={styles.galleryMoreBtn} onClick={() => setGalleryOpen(true)}>Ver galería completa <IconArrow /></button></div>
            </div>
          )}
        </div>
      </RevealSection>

      {galleryOpen && (
        <div className={extraStyles.galleryPanelImproved} onClick={() => setGalleryOpen(false)}>
          <div className={extraStyles.galleryPanelInnerImproved} onClick={e => e.stopPropagation()}>
            <div className={styles.galleryPanelHeader}><p className={styles.galleryPanelTitle}>Galería completa · {allGallery.length} imágenes</p><button className={styles.galleryPanelClose} onClick={() => setGalleryOpen(false)}><IconClose /></button></div>
            <div className={extraStyles.galleryPanelGridImproved}>
              {allGallery.map((img: any, i: number) => (
                <div key={i} className={`${extraStyles.galleryPanelItemImproved} ${extraStyles.hoverZoom}`} onClick={() => setLightboxState({ images: allGallery, index: i })}>
                  <div className={extraStyles.galleryPanelImgWrapImproved}>{img.isVideo ? <video src={img.url} autoPlay muted loop playsInline /> : <img loading="lazy" src={img.url} alt={img.caption} />}</div>
                  {img.caption && <p className={styles.galleryPanelCaption}>{img.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {property.amenities && property.amenities.length > 0 && (
        <RevealSection className={styles.amenities} id="amenities">
          <div className={styles.amenitiesLeft}>
            <p className={styles.eyebrow}>Amenities</p>
            <h2 className={styles.amenitiesTitle}>Bienestar en<br />cada detalle.</h2>
            <p className={styles.amenitiesDesc}>Espacios diseñados para disfrutar en familia, recibir con elegancia y relajarse en completo confort.</p>
            <AmenitiesGrouped amenities={property.amenities} />
          </div>
          <div className={styles.amenitiesRight}><img loading="lazy" src={property.amenitiesImage || property.posterHero} alt="Amenities" /><div className={styles.amenitiesImgOverlay} /></div>
        </RevealSection>
      )}

      {property.lifestyle && (
        <RevealSection className={styles.lifestyle} id="entorno">
          <div className={styles.lifestyleInner}>
            <div className={styles.lifestyleTop}>
              <div className={styles.lifestyleHeroImg}><img loading="lazy" src={property.lifestyle.image || property.posterHero} alt={property.lifestyle.title} /></div>
              <div className={styles.lifestyleHeader}>
                <p className={styles.eyebrow}>{property.lifestyle.eyebrow}</p>
                <h2 className={styles.lifestyleTitle}>{property.lifestyle.title}</h2>
                {(property.lifestyle.introParagraphs || [property.lifestyle.intro]).filter(Boolean).map((para: string, i: number) => (<p key={i} className={styles.lifestyleIntro} style={i > 0 ? { marginTop: '1.5rem', marginBottom: '0.75rem' } : {}}>{para}</p>))}
                <a href="/entorno" className={styles.locationBtnSecondary} style={{ marginTop: "2rem", display: "inline-block" }}>Descubre San Bernardino →</a>
              </div>
            </div>
            <div className={styles.lifestyleGrid}>
              {property.lifestyle.items.map((it: any, i: number) => (
                <div key={i} className={styles.lifestyleCard}><span className={styles.lifestyleNum}>{String(i + 1).padStart(2, '0')}</span><h3 className={styles.lifestyleCardTitleBig}>{it.title}</h3><p className={styles.lifestyleCardDesc}>{it.desc}</p></div>
              ))}
            </div>
          </div>
        </RevealSection>
      )}

      <FullBleedBreak src="https://larumstudio.com/wp-content/uploads/2026/07/Piscina-2560px-upscaled.webp" caption="Residencia San Bernardino" />

      <RevealSection className={styles.location} id="ubicacion">
        <div className={styles.locationInner}>
          <div className={styles.locationLeft}>
            <p className={styles.eyebrow}>Ubicación</p>
            <h2 className={styles.locationTitle}>{property.location.city}</h2>
            {property.location.landmarks && (
              <div className={styles.landmarksList}>
                <p className={styles.landmarksNearby}>PUNTOS DE INTERÉS</p>
                <div className={styles.landmarksCols}>
                  <div className={styles.landmarksCol}>
                    {property.location.landmarks.slice(0, Math.ceil(property.location.landmarks.length / 2)).map((lm: any, i: number) => (
                      <div key={i} className={styles.landmarkRow}><div className={styles.landmarkRowIcon}>{getLandmarkIcon(lm)}</div><span className={styles.landmarkRowName}>{getLandmarkName(lm)}</span><span className={styles.landmarkRowTime}>{getLandmarkDetail(lm)}{getLandmarkMinutes(lm) ? `· ${getLandmarkMinutes(lm)} min` : ''}</span></div>
                    ))}
                  </div>
                  <div className={styles.landmarksCol}>
                    {property.location.landmarks.slice(Math.ceil(property.location.landmarks.length / 2)).map((lm: any, i: number) => (
                      <div key={i} className={styles.landmarkRow}><div className={styles.landmarkRowIcon}>{getLandmarkIcon(lm)}</div><span className={styles.landmarkRowName}>{getLandmarkName(lm)}</span><span className={styles.landmarkRowTime}>{getLandmarkDetail(lm)}{getLandmarkMinutes(lm) ? `· ${getLandmarkMinutes(lm)} min` : ''}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={styles.locationRight}>
            <div className={styles.locationMap}>{property.location.mapImage ? <><img loading="lazy" src={property.location.mapImage} alt={property.location.city} className={styles.mapPhoto} /><div className={styles.mapPhotoOverlay} /></> : <svg className={styles.mapGrid} preserveAspectRatio="none"><defs><pattern id="gridP" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="#ffffff" strokeWidth="0.4" /></pattern></defs><rect width="100%" height="100%" fill="url(#gridP)" /></svg>}</div>
            {property.location.mapsUrl && <div className={styles.locationMapBtn}><a href={property.location.mapsUrl} target="_blank" rel="noopener" className={styles.locationBtn}>Descubrir en el Mapa</a></div>}
          </div>
        </div>
      </RevealSection>

      {property.floorPlan && property.floorPlan.areas && (
        <RevealSection className={styles.plano} id="plano">
          <div className={styles.planoInner}>
            <div className={styles.planoHeader}><p className={styles.eyebrow}>Un recorrido con sentido</p><h2 className={styles.planoTitleTop}>Donde cada espacio encuentra su razón de ser.</h2></div>
            <div className={styles.planoTwoCol}>
              {property.floorPlan.image && <div className={styles.planoImgCol}><img loading="lazy" src={property.floorPlan.image} alt="Plano" /></div>}
              <div className={styles.planoTableCol}><table className={styles.areaTable}><thead><tr><th>Ambiente</th><th>Superficie aprox.</th></tr></thead><tbody>{property.floorPlan.areas.map((a: any, i: number) => (<tr key={i}><td>{a.ambiente}</td><td>{a.superficie}</td></tr>))}</tbody></table></div>
            </div>
          </div>
        </RevealSection>
      )}

      {property.loQueNoSeVe && <LoQueNoSeVeSection data={property.loQueNoSeVe} />}

      {property.gastos && property.gastos.length > 0 && (
        <RevealSection className={styles.gastosSection}>
          <div className={styles.gastosInner}>
            <div style={{ marginBottom: '2rem' }}><p className={styles.eyebrow}>Gastos estimados</p></div>
            <div className={styles.gastosGrid}>{property.gastos.map((g: any, i: number) => (<div key={i} className={styles.gastoItem}><div className={styles.gastoIconWrap}>{gastoIcons[g.icono] || gastoIcons['otro']}</div><div className={styles.gastoInfo}><span className={styles.gastoConcepto}>{g.concepto}</span><span className={styles.gastoValor}>{g.valor}</span></div></div>))}</div>
          </div>
        </RevealSection>
      )}

      {property.inversion && <InversionSection data={property.inversion} />}

      <RevealSection className={styles.trustDocsSection}>
        <div className={styles.trustDocsHeader}><p className={styles.eyebrow}>Recursos</p><h2 className={styles.sectionTitle}>Todo lo que necesita para evaluar con criterio.</h2></div>
        <div className={extraStyles.recursosGrid}>
          <div>
            <h3 className={styles.trustDocsColTitle}>Documentación</h3>
            {property.descargables && property.descargables.length > 0 ? <DocumentationCards docs={property.descargables} /> : null}
          </div>
          <div>
            <h3 className={styles.trustDocsColTitle}>Garantías</h3>
            <div className={styles.garantiaAccordion}>
              {['Documentación al día y verificada', 'Libre de gravámenes, impuestos e hipotecas', 'Título original y lista para escriturar', 'Proceso de compra acompañado y transparente'].map((item, i) => (
                <details key={i} className={styles.garantiaAccItem}><summary className={styles.garantiaAccSummary}><span className={styles.garantiaAccCheck}><IconCheck /></span><span className={styles.garantiaAccLabel}>{item}</span><span className={styles.garantiaAccChevron}><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M6 9l6 6 6-6"/></svg></span></summary><div className={styles.garantiaAccBody}><p>Verificado y documentado como parte del proceso de compra acompañada.</p></div></details>
              ))}
            </div>
            <h3 className={styles.trustDocsColTitle} style={{ marginTop: '2rem' }}>Calculadoras</h3>
            <div className={styles.calcGrid}>
              <div className={styles.calcCard} style={{ cursor: 'default' }}><div className={styles.calcIconWrap}><svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M12 2v4M8 4v2M16 4v2"/><rect x="3" y="8" width="18" height="14" rx="2"/><path d="M3 14h18"/><path d="M7 11h2M11 11h2M15 11h2M7 18h2M11 18h2"/></svg></div><span className={styles.calcLabel}>Potencial de renta</span><p style={{ fontSize: '0.72rem', lineHeight: 1.5, color: 'rgba(30,25,15,0.5)', marginTop: '0.5rem' }}>San Bernardino presenta una demanda creciente de alquiler vacacional premium. Solicite un informe personalizado de rentabilidad proyectada para esta propiedad.</p></div>
              <button type="button" className={styles.calcCard} onClick={() => setCalculatorOpen('purchase')}><div className={styles.calcIconWrap}><svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M9 22V12h6v10"/></svg></div><span className={styles.calcLabel}>Calcula el coste de compra</span><span className={styles.calcArrow}>→</span></button>
            </div>
          </div>
        </div>
      </RevealSection>

      {property.faq && <FAQSection items={property.faq} />}

      <RevealSection className={styles.memoria} id="memoria">
        <div className={styles.memoriaBalanced}>
          <div className={styles.memoriaBalancedLeft}>
            <p className={styles.eyebrow}>Documentación</p>
            <h2 className={styles.memoriaTitle}>Memoria de la Residencia.</h2>
            <p className={styles.memoriaDesc}>No es un catálogo. Es un documento privado, elaborado con criterio y discreción.</p>
            <p className={styles.memoriaMetaInline}>Documento privado · PDF exclusivo · envío inmediato</p>
            <div className={styles.memoriaInlineForm}><BrochureForm agentEmail={property.agentEmail} compact={true} privacidadTexto={property.privacidadTexto} privacidadUrl={property.privacidadUrl} brochureUrl={property.brochure} /></div>
          </div>
          {property.brochurePages && property.brochurePages.length > 0 && (
            <div className={styles.memoriaBalancedRight} style={property.brochurePages.length === 1 ? { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0', background: '#f5f3ef', borderRadius: '0', overflow: 'visible' } : { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '2rem', background: '#f5f3ef', borderRadius: '6px', alignContent: 'center' }}>
              {property.brochurePages.map((page: string, i: number) => (
                <img key={i} loading="lazy" src={page} alt={`Memoria página ${i + 1}`} style={property.brochurePages.length === 1 ? { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0' } : { width: '100%', height: 'auto', objectFit: 'contain', borderRadius: '3px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }} />
              ))}
            </div>
          )}
        </div>
      </RevealSection>

      {(agent.bio || agent.authority) && (
        <RevealSection className={styles.agentExpanded}>
          <div className={styles.agentExpandedInner}>
            <div className={styles.agentExpandedPhoto}><img loading="lazy" src="https://larumstudio.com/wp-content/uploads/2026/07/William-Rowe-scaled.webp" alt="William Rowe" /></div>
            <div className={styles.agentExpandedInfo}>
              <p className={styles.agentExpandedCargo}>Senior Advisor · Luxury Properties</p>
              <h2 className={styles.agentExpandedName}>William Rowe</h2>
              <p className={styles.agentExpandedBio}>No trabaja con volumen. Trabaja con criterio.</p>
              <p className={styles.agentExpandedBio} style={{ marginTop: '1rem' }}>Representa solo un número selecto de residencias al año —aquellas que poseen carácter, ubicación privilegiada y una historia que merece ser contada con precisión. Cada una es tratada como una obra singular: estudiada, narrada y posicionada para encontrar al comprador que realmente la entiende.</p>
              <p className={styles.agentExpandedBio} style={{ marginTop: '1rem' }}>Su enfoque combina conocimiento profundo del mercado de alto nivel, discreción absoluta y una capacidad única para transmitir el valor emocional de cada propiedad.</p>
              <p className={styles.agentExpandedBio} style={{ marginTop: '1rem', fontStyle: 'italic', opacity: 0.7 }}>Idiomas: Inglés, Español, Alemán</p>
              <div className={styles.agentStatsRow}>
                <div className={styles.agentStatItem}><div className={styles.agentStatVal}>40</div><div className={styles.agentStatLabel}>propiedades de lujo</div></div>
                <div className={styles.agentStatItem}><div className={styles.agentStatVal}>US$125M</div><div className={styles.agentStatLabel}>ventas concretadas</div></div>
                <div className={styles.agentStatItem}><div className={styles.agentStatVal}>5 años</div><div className={styles.agentStatLabel}>asesorando élite</div></div>
                <div className={styles.agentStatItem}><div className={styles.agentStatVal}>3 de 10</div><div className={styles.agentStatLabel}>propiedades aceptadas</div></div>
              </div>
              <div className={styles.agentExpandedBtns}>
                <a href={whatsappUrl} target="_blank" rel="noopener" className={styles.agentExpandedBtn}><IconWhatsapp /> WHATSAPP</a>
                <a href={agent.email ? `mailto:${agent.email}` : '#'} className={styles.agentExpandedBtn}><IconMail /> EMAIL</a>
                <a href="https://www.linkedin.com/company/larumstudiohq/" target="_blank" rel="noopener" className={styles.agentExpandedBtn}><IconLinkedin /> LINKEDIN</a>
                <a href="https://www.instagram.com/larumstudio/" target="_blank" rel="noopener" className={styles.agentExpandedBtn}><IconInstagram /> INSTAGRAM</a>
              </div>
            </div>
          </div>
        </RevealSection>
      )}

      <FullBleedBreak src="https://larumstudio.com/wp-content/uploads/2026/07/Salon-2560px-upscaled.webp" />

      <RevealSection className={styles.contact} id="contacto">
        <div className={styles.contactClean}>
          <div className={styles.contactCleanLeft}>
            <p className={styles.contactEyebrow}>Acceso Privado</p>
            <h2 className={styles.contactTitle}>Visitas bajo cita.</h2>
            <div className={styles.contactEditorial}>
              <p>Esta residencia no se exhibe en portales. Las visitas se coordinan de forma privada y bajo cita previa.</p>
              <p className={extraStyles.urgenciaSutil}>Esta residencia se presenta a un número selecto de familias este trimestre · La agenda de visitas tiene disponibilidad limitada</p>
            </div>
          </div>
          <div className={styles.contactQrCenter}><img src="https://larumstudio.com/wp-content/uploads/2026/07/qr-code.png" alt="QR" style={{ width: '280px', height: '280px', maxWidth: '100%', objectFit: 'contain', display: 'block', margin: '0 auto' }} /><span className={styles.contactQrLabel} style={{ marginTop: '1.5rem', display: 'block' }}>Escanea para acceder</span></div>
          <div className={styles.contactForm}>
            {[{ name: 'nombre', placeholder: 'NOMBRE', type: 'text' }, { name: 'email', placeholder: 'EMAIL', type: 'email' }, { name: 'telefono', placeholder: 'TELÉFONO', type: 'tel' }, { name: 'fecha', placeholder: 'FECHA PREFERIDA', type: 'text' }].map(field => (
              <div key={field.name} className={styles.formField}><input type={field.type} name={field.name} placeholder={field.placeholder} value={form[field.name as keyof typeof form]} onChange={e => setForm({ ...form, [e.target.name]: e.target.value })} className={styles.formInput} /></div>
            ))}
            <button type="button" className={styles.formBtn}>Solicitar agenda privada</button>
          </div>
        </div>
      </RevealSection>

      <footer className={styles.footer}>
        <div className={styles.footerInner}><div className={styles.footerCol}><div className={styles.footerLogo}>{property.footerTitulo || 'LARUM STUDIO'}</div><p className={styles.footerTagline}>{property.footerDesc || 'Micrositios inmobiliarios de alto impacto.'}</p></div><nav className={styles.footerNavGrid}>{navLinks.map(l => <a key={l.href} href={l.href} className={styles.footerLink}>{l.label}</a>)}</nav></div>
        <div className={styles.footerBottom}><span>© 2026 {property.footerTitulo || 'Larum Studio'}. Todos los derechos reservados.</span></div>
      </footer>

      {/* WhatsApp integrado en sección de agente, no flotante */}
      <AnalyticsScripts ga4Id={property.ga4Id} metaPixelId={property.metaPixelId} />
    </div>
  )
}
