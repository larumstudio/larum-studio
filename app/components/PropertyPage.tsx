'use client'
import React, { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import styles from '../page.module.css'
import CalculatorModal, { type CalculatorType } from './calculators/CalculatorModal'
import { amenityLabel } from '../lib/i18n'
import LanguageSwitch from './LanguageSwitch'
import { useAdaptiveNavTone } from './AdaptiveNav'
function useReveal() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, className: visible ? `${styles.reveal} ${styles.revealVisible}` : styles.reveal };
}

function useParallax(speed = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const img = el.querySelector('img, video') as HTMLElement | null;
    if (!img) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        if (rect.bottom < 0 || rect.top > vh) return;
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        img.style.transform = `translateY(${progress * speed * 100}px) scale(1.12)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [speed]);
  return ref;
}

function ParallaxImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useParallax();
  return (
    <div ref={ref} className={`${styles.parallaxWrap} ${className || ''}`}>
      <img loading="lazy" src={src} alt={alt} />
    </div>
  );
}

function FullBleedBreak({ src, caption }: { src: string; caption?: string }) {
  const ref = useParallax(0.18);
  const reveal = useReveal();
  return (
    <section ref={reveal.ref as any} className={`${reveal.className} ${styles.fullBleed}`}>
      <div ref={ref} className={styles.fullBleedImgWrap}>
        <img loading="lazy" src={src} alt={caption || ''} />
      </div>
      <div className={styles.fullBleedOverlay} />
      {caption && <p className={styles.fullBleedCaption}>{caption}</p>}
    </section>
  );
}

const IconPlay = () => <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
const IconArrow = () => <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13,6 19,12 13,18" /></svg>
const IconPhone = () => <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 012 1.18 2 2 0 014 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
const IconMail = () => <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
const IconInstagram = () => <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
const IconWhatsapp = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
const IconMenu = () => <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></svg>
const IconClose = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
const IconCheck = () => <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><polyline points="20,6 9,17 4,12" /></svg>
const IconDownload = () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7,10 12,15 17,10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
const IconLinkedin = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
const IconCalendar = () => <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>

/* ─── LANDMARK ICONS (SSR-safe, no typeof window) ─── */
const landmarkIcons: Record<string, React.ReactNode> = {
  playa: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M2 20h20M5 20c0-4 3-7 7-7s7 3 7 7"/><path d="M12 13V3M9 6l3-3 3 3"/></svg>,
  centro: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 6h2M9 10h2M9 14h2M13 6h2M13 10h2"/></svg>,
  golf: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M12 2v15"/><path d="M12 2l6 4-6 4"/><circle cx="12" cy="20" r="2"/></svg>,
  restaurante: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M3 2v7c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V2M7 2v20M21 15V2c-2 0-4 1.5-4 4v5c0 1.1.9 2 2 2h2v7"/></svg>,
  puerto: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M2 21c2-1 4-1 6 0s4 1 6 0 4-1 6 0"/><path d="M12 3v13"/><circle cx="12" cy="16" r="2"/><path d="M4 16V8l8-5 8 5v8"/></svg>,
  aeropuerto: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M2 15l5-1 3-7 2 1-2 6 5-1 2-3 2 1-1 4 4-1v2l-18 4z"/></svg>,
  hospital: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12h6M12 9v6"/></svg>,
  colegio: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></svg>,
  supermercado: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>,
  club: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><circle cx="12" cy="8" r="5"/><path d="M3 20a9 9 0 0118 0"/></svg>,
  lago: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M2 17c2-1 4-1 6 0s4 1 6 0 4-1 6 0M2 21c2-1 4-1 6 0s4 1 6 0 4-1 6 0"/><circle cx="12" cy="10" r="4"/></svg>,
  montaña: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M8 21l4-10 4 10M2 21l6-12 3 6M16 21l4-8 2 4"/></svg>,
  tren: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><rect x="4" y="3" width="16" height="16" rx="3"/><path d="M4 11h16M12 3v8M8 22l2-3h4l2 3"/><circle cx="8" cy="15" r="1" fill="currentColor"/><circle cx="16" cy="15" r="1" fill="currentColor"/></svg>,
  metro: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M6 19L3 22M18 19l3 3"/><rect x="5" y="3" width="14" height="16" rx="4"/><path d="M5 12h14"/><circle cx="9" cy="16" r="1" fill="currentColor"/><circle cx="15" cy="16" r="1" fill="currentColor"/></svg>,
  universidad: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M2 10l10-5 10 5-10 5z"/><path d="M22 10v6"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></svg>,
  parque: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M12 22V8"/><path d="M12 8a5 5 0 000-6 5 5 0 000 6z"/><path d="M7 17c1.5-1 3.5-1 5 0s3.5 1 5 0"/></svg>,
  marina: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M2 20c2-1 4-1 6 0s4 1 6 0 4-1 6 0"/><path d="M12 4v12"/><path d="M12 4l5 4-5 4"/></svg>,
  shopping: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  financiero: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M3 21h18M3 7l9-4 9 4"/><path d="M6 7v10M10 7v10M14 7v10M18 7v10"/><path d="M3 17h18"/></svg>,
  basilica: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M12 2v4M9 6h6"/><path d="M4 22V10l8-4 8 4v12"/><path d="M9 22v-5a3 3 0 016 0v5"/><path d="M12 6a3 3 0 010 4"/></svg>,
  iglesia: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M12 2v4M9 6h6"/><path d="M4 22V10l8-4 8 4v12"/><path d="M9 22v-5a3 3 0 016 0v5"/><path d="M12 6a3 3 0 010 4"/></svg>,
  nautico: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M2 20c2-1 4-1 6 0s4 1 6 0 4-1 6 0"/><path d="M12 16V4"/><path d="M12 4l-6 8h12z"/></svg>,
  medico: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12h6M12 9v6"/><path d="M8 3v2M16 3v2"/></svg>,
  otro: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M12 22s8-7 8-12a8 8 0 10-16 0c0 5 8 12 8 12z"/><circle cx="12" cy="10" r="3"/></svg>,
}

/* ─── LANDMARK ALIAS MAP (case-insensitive, accent-stripped) ─── */
const landmarkAlias: Record<string, string> = {
  'aeropuerto asu': 'aeropuerto',
  'asuncion golf club': 'golf',
  'club centenario': 'club',
  'club nautico san bernardino': 'nautico',
  'shopping del sol': 'shopping',
  'centro financiero de asuncion': 'financiero',
  'basilica de caacupe': 'basilica',
  'centro medico bautista': 'medico',
}

/* ─── LANDMARK HELPERS (dual format: viejo {label,top,left} + nuevo {nombre,icono,detalle,minutos}) ─── */
function normalizeLandmarkKey(raw: string): string {
  return (raw || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function getLandmarkName(lm: any): string {
  return lm.nombre || lm.name || lm.label || ''
}

function getLandmarkIcon(lm: any): React.ReactNode {
  const rawIcon = lm.icono || lm.icon || lm.type || lm.label || ''
  const key = normalizeLandmarkKey(rawIcon)
  // Try direct match first, then alias, then fallback
  if (landmarkIcons[key]) return landmarkIcons[key]
  const aliasKey = landmarkAlias[key]
  if (aliasKey && landmarkIcons[aliasKey]) return landmarkIcons[aliasKey]
  // Try alias by nombre too
  const nameKey = normalizeLandmarkKey(getLandmarkName(lm))
  const nameAlias = landmarkAlias[nameKey]
  if (nameAlias && landmarkIcons[nameAlias]) return landmarkIcons[nameAlias]
  return landmarkIcons['otro']
}

function getLandmarkDetail(lm: any): string {
  return lm.detalle || ''
}

function getLandmarkMinutes(lm: any): string | number {
  return lm.minutos || lm.min || ''
}

const gastoIcons: Record<string, React.ReactNode> = {
  edificio: <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 6h2M9 10h2M9 14h2M13 6h2M13 10h2M13 14h2M9 22v-4h6v4"/></svg>,
  comunidad: <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-4h6v4"/></svg>,
  basura: <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M3 6h18M8 6V4h8v2"/><path d="M5 6v14a2 2 0 002 2h10a2 2 0 002-2V6"/><path d="M10 11v6M14 11v6"/></svg>,
  agua: <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M12 2s8 6 8 12a8 8 0 11-16 0c0-6 8-12 8-12z"/></svg>,
  electricidad: <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M13 2L3 14h9l-1 8 10-12h-9z"/></svg>,
  gas: <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M12 22c4.97 0 9-3.58 9-8 0-3-2-5.5-5-7-1 2-3 3.5-4 4-1-1.5-1-3-1-5-3 1.5-5 4-5 7 0 4.97 2.69 9 6 9z"/></svg>,
  seguro: <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M12 2l9 4v6c0 5-4 9-9 10C7 21 3 17 3 12V6l9-4z"/></svg>,
  mantenimiento: <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
  otro: <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
}

function AnalyticsScripts({ ga4Id, metaPixelId }: { ga4Id?: string; metaPixelId?: string }) {
  if (!ga4Id && !metaPixelId) return null;
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
  );
}

const navLinksEs = [
  { href: '#residencia', label: 'Residencia' },
  { href: '#galeria', label: 'Galería' },
  { href: '#amenities', label: 'Comodidades' },
  { href: '#entorno', label: 'Entorno' },
  { href: '#ubicacion', label: 'Ubicación' },
  { href: '#contacto', label: 'Contacto' },
]
const navLinksEn = [
  { href: '#residencia', label: 'Residence' },
  { href: '#galeria', label: 'Gallery' },
  { href: '#amenities', label: 'Amenities' },
  { href: '#entorno', label: 'Area' },
  { href: '#ubicacion', label: 'Location' },
  { href: '#contacto', label: 'Contact' },
]

const amenityIcons: Record<string, React.ReactNode> = {
  'PISCINA INFINITA': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M3 16h18M3 16a9 9 0 0118 0M6 16V10a6 6 0 0112 0v6"/><path d="M2 20h20M12 4v2"/></svg>,
  'ÁREA GOURMET': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M3 22V8a1 1 0 011-1h4V5a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v14"/><path d="M10 22v-5h4v5M7 10h2v3H7zM15 10h2v3h-2z"/></svg>,
  'GIMNASIO PRIVADO': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M6 18V9M18 18V9M3 9h18M7 9V5a2 2 0 012-2h6a2 2 0 012 2v4"/><path d="M10 13h4M10 16h4M3 18h18v2H3z"/></svg>,
  'HOME THEATER': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 20h8M12 18v2"/><circle cx="12" cy="11" r="3"/></svg>,
  'JARDÍN INTERNO': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M12 2a5 5 0 000 10 5 5 0 000-10z"/><path d="M12 12v10M7 17c1.5-1 3.5-1 5 0s3.5 1 5 0"/><path d="M4 21c1.5-1 3.5-1 5 0s3.5 1 5 0s3.5 1 5 0"/></svg>,
  'JACUZZI EXTERIOR': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><ellipse cx="12" cy="17" rx="8" ry="3"/><path d="M4 17v-3a8 8 0 0116 0v3"/><path d="M8 14c0-2.2 1.8-4 4-4s4 1.8 4 4"/><circle cx="12" cy="7" r="2"/></svg>,
  'PISCINA CUBIERTA': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M3 16h18M3 16a9 9 0 0118 0M6 16V10a6 6 0 0112 0v6"/><path d="M3 4h18M12 4v2"/></svg>,
  'PISCINA INFINITY': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M2 16h20M2 16a10 10 0 0120 0M5 16V10a7 7 0 0114 0v6"/><path d="M2 20c2-1 4-1 6 0s4 1 6 0 4-1 6 0"/></svg>,
  'JACUZZI INTERIOR': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><ellipse cx="12" cy="17" rx="8" ry="3"/><path d="M4 17v-3a8 8 0 0116 0v3"/><path d="M8 14c0-2.2 1.8-4 4-4s4 1.8 4 4"/><circle cx="12" cy="7" r="2"/></svg>,
  'COCINA GOURMET': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M4 3h16v5H4zM4 8h16v13H4z"/><path d="M9 8v13M15 8v13M8 14h8"/></svg>,
  'CINE PRIVADO': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 20h8M12 18v2"/><path d="M9 9l7 3.5-7 3.5V9z"/></svg>,
  'JARDÍN EXTERIOR': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M12 2a5 5 0 000 10 5 5 0 000-10z"/><path d="M12 12v10M7 17c1.5-1 3.5-1 5 0s3.5 1 5 0"/><path d="M4 21c1.5-1 3.5-1 5 0s3.5 1 5 0s3.5 1 5 0"/></svg>,
  'TERRAZA PRIVADA': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M3 10h18M3 10l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M9 21v-6h6v6"/></svg>,
  'SAUNA': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M9 3c0 4 4 5 4 9M12 3c0 4 4 5 4 9M6 3c0 4 4 5 4 9"/><rect x="3" y="14" width="18" height="7" rx="1"/></svg>,
  'SPA': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M12 22c4.97 0 9-3.58 9-8 0-3-2-5.5-5-7-1 2-3 3.5-4 4-1-1.5-1-3-1-5-3 1.5-5 4-5 7 0 4.97 2.69 9 6 9z"/></svg>,
  'SALA DE MASAJES': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M4 6h16M4 10h16M4 14h16"/><ellipse cx="12" cy="18" rx="5" ry="3"/></svg>,
  'ESTUDIO DE YOGA': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><circle cx="12" cy="5" r="2"/><path d="M12 7v6M8 10l4 3 4-3M8 17l4-4 4 4"/></svg>,
  'SALA DE JUEGOS': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><rect x="2" y="6" width="20" height="12" rx="3"/><path d="M8 12h4M10 10v4"/><circle cx="16" cy="11" r="1" fill="currentColor"/><circle cx="16" cy="14" r="1" fill="currentColor"/></svg>,
  'SALA DE VINO': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M8 3h8l2 7a6 6 0 01-12 0L8 3z"/><path d="M12 16v5"/><path d="M8 21h8"/></svg>,
  'BODEGA': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M8 3l-4 6h16l-4-6H8z"/><path d="M6 9v10a1 1 0 001 1h10a1 1 0 001-1V9"/><circle cx="12" cy="14" r="2"/></svg>,
  'MINI BAR': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M8 3h8l1 5H7L8 3z"/><rect x="5" y="8" width="14" height="13" rx="1"/><path d="M9 21v-5h6v5"/></svg>,
  'BAR PRIVADO': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M7 3l-4 8h18L17 3H7z"/><path d="M3 11v9a1 1 0 001 1h16a1 1 0 001-1v-9"/><path d="M12 11v10"/></svg>,
  'BIBLIOTECA': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14"/><path d="M2 19h20"/><path d="M9 3v11l3-2 3 2V3"/></svg>,
  'ESTUDIO': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 8h2M11 8h6M7 11h10"/></svg>,
  'CHIMENEA': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M4 20h16M4 20V10h4v10M16 20V10h4v10M8 10V6h8v4"/><path d="M10 6c0-2 1-3 2-4 1 1 2 2 2 4"/></svg>,
  'SALA DE ESTAR': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M4 17V9a2 2 0 012-2h12a2 2 0 012 2v8"/><path d="M2 17h20M2 17a2 2 0 002 2h16a2 2 0 002-2"/><path d="M8 9v3M16 9v3"/></svg>,
  'COMEDOR FORMAL': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><rect x="4" y="10" width="16" height="8" rx="1"/><path d="M8 10V7M12 10V6M16 10V7M4 18h16"/></svg>,
  'SUITE PRINCIPAL': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M2 9V6a2 2 0 012-2h16a2 2 0 012 2v3"/><path d="M2 9h20v11a2 2 0 01-2 2H4a2 2 0 01-2-2V9z"/><path d="M8 9V5M16 9V5"/></svg>,
  'VESTIDOR': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M3 3h18v18H3z"/><path d="M12 3v18M3 9h18M3 15h18"/></svg>,
  'BAÑO EN SUITE': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M4 12h16v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4z"/><path d="M4 12V6a2 2 0 012-2h1a2 2 0 012 2v6"/><path d="M2 12h20"/></svg>,
  'GARAJE': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M8 21V14h8v7"/></svg>,
  'ESTACIONAMIENTO': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M9 8h4a3 3 0 010 6H9V8zM9 11h4"/></svg>,
  'SEGURIDAD 24H': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M12 2l9 4v6c0 5-4 9-9 10C7 21 3 17 3 12V6l9-4z"/></svg>,
  'CONCIERGE': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><circle cx="12" cy="8" r="4"/><path d="M3 20a9 9 0 0118 0"/></svg>,
  'LAVANDERÍA': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><rect x="2" y="2" width="20" height="20" rx="3"/><circle cx="12" cy="13" r="5"/><circle cx="12" cy="13" r="2"/><path d="M7 6h2"/></svg>,
  'SERVICIO DE LIMPIEZA': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M3 21l5-5M14 4l6 6-9 9-6-6 9-9z"/><path d="M5 16l3 3"/></svg>,
  'CANCHA DE TENIS': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><rect x="2" y="4" width="20" height="16" rx="1"/><path d="M12 4v16M2 12h20M7 4v16M17 4v16"/></svg>,
  'PISTA DE PADDLE': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><rect x="2" y="4" width="20" height="16" rx="1"/><path d="M12 4v16M2 12h20"/><circle cx="7" cy="8" r="1.5" fill="currentColor"/></svg>,
  'CAMPO DE GOLF': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M12 2v15"/><path d="M12 2l6 4-6 4"/><circle cx="12" cy="20" r="2"/><path d="M6 20h12"/></svg>,
  'MUELLE PRIVADO': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M3 18h18M6 18V8M12 18V5M18 18V8"/><path d="M3 8h18"/></svg>,
  'PLAYA PRIVADA': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M3 20h18"/><path d="M8 20c0-6 4-10 4-10s4 4 4 10"/><path d="M12 10V4M9 7l3-3 3 3"/></svg>,
  'HELIPUERTO': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><circle cx="12" cy="12" r="9"/><path d="M8 8h3v8H8zM13 8h3v8h-3zM11 12h2"/></svg>,
  'ASCENSOR PRIVADO': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 9l3-3 3 3M9 15l3 3 3-3"/></svg>,
  'ACCESO PRIVADO': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  'VISTA AL MAR': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M2 17c2-1 4-1 6 0s4 1 6 0 4-1 6 0M2 21c2-1 4-1 6 0s4 1 6 0 4-1 6 0"/><circle cx="12" cy="10" r="4"/><path d="M12 2v2M4.9 4.9l1.4 1.4M2 10h2M19.1 4.9l-1.4 1.4M22 10h-2"/></svg>,
  'VISTA PANORÁMICA': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M3 7h18M3 12h18M3 17h18"/><path d="M7 3v18M17 3v18"/></svg>,
  'CANCHA DE FÚTBOL': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><rect x="2" y="4" width="20" height="16" rx="1"/><circle cx="12" cy="12" r="4"/><path d="M2 8h20M2 16h20M8 4v16M16 4v16"/></svg>,
  'CANCHA DE VOLEIBOL': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><rect x="2" y="4" width="20" height="16" rx="1"/><path d="M12 4v16M2 12h20"/><circle cx="12" cy="8" r="2"/></svg>,
  'SALA DE REUNIONES': <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><rect x="2" y="6" width="20" height="14" rx="1"/><path d="M8 6V4h8v2"/><path d="M6 11h12M6 14h8"/></svg>,
}
const defaultIcon = <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><circle cx="12" cy="12" r="9"/></svg>

const featureIcons: React.ReactNode[] = [
  <svg key="0" width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>,
  <svg key="1" width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><rect x="2" y="2" width="9" height="9" rx="1"/><rect x="13" y="2" width="9" height="9" rx="1"/><rect x="2" y="13" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"/></svg>,
  <svg key="2" width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M3 12h18M12 3v18"/></svg>,
  <svg key="3" width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  <svg key="4" width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M9 22V12h6v10"/></svg>,
  <svg key="5" width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
]

const featureIconByName: Record<string, React.ReactNode> = {
  'Reloj': <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>,
  'Cuadricula': <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><rect x="2" y="2" width="9" height="9" rx="1"/><rect x="13" y="2" width="9" height="9" rx="1"/><rect x="2" y="13" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"/></svg>,
  'Cruz': <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M3 12h18M12 3v18"/></svg>,
  'Sol': <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  'Casa': <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M9 22V12h6v10"/></svg>,
  'Escudo': <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  'Estrella': <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M12 2l3 6.5 7 .8-5 4.8 1.3 7L12 17.5 5.7 21l1.3-7-5-4.8 7-.8z"/></svg>,
  'Ubicacion': <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M12 22s8-7 8-12a8 8 0 10-16 0c0 5 8 12 8 12z"/><circle cx="12" cy="10" r="3"/></svg>,
  'Hoja': <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>,
  'Diamante': <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M12 3L8 9l4 12 4-12z"/></svg>,
  'Llave': <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><circle cx="8" cy="8" r="5"/><path d="M11.5 11.5L21 21M16 16l3-3M19 19l2-2"/></svg>,
  'Corazon': <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M12 21s-8-5-8-11a4.5 4.5 0 018-3 4.5 4.5 0 018 3c0 6-8 11-8 11z"/></svg>,
}



function PageLoader() {
  const [loaded, setLoaded] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const timer1 = setTimeout(() => setLoaded(true), 800);
    const timer2 = setTimeout(() => setHidden(true), 1500);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);
  if (hidden) return null;
  return (
    <div className={`${styles.pageLoader} ${loaded ? styles.pageLoaderExit : ''}`}>
      <div className={styles.pageLoaderLogo}>LARUM</div>
      <div className={styles.pageLoaderBar}><div className={styles.pageLoaderBarFill} /></div>
    </div>
  );
}

function RevealSection({ children, className = '', as = 'section', id, style }: { children: React.ReactNode; className?: string; as?: 'section' | 'div' | 'footer'; id?: string; style?: React.CSSProperties }) {
  const reveal = useReveal();
  const Tag = as;
  return <Tag ref={reveal.ref as any} className={`${reveal.className} ${styles.stagger} ${className}`} id={id} style={style}>{children}</Tag>;
}

function BrochureForm({ agentEmail, compact, privacidadTexto, privacidadUrl, lang = 'es', brochureUrl }: { agentEmail: string, compact?: boolean, privacidadTexto?: string, privacidadUrl?: string, lang?: 'es' | 'en', brochureUrl?: string }) {
  const [submitted, setSubmitted] = React.useState(false)
  const [nombre, setNombre] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [whatsapp, setWhatsapp] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const canSubmit = whatsapp.trim() !== ''

  const T = lang === 'en' ? {
    successTitle: 'We have received your request.',
    successDesc: 'We will be in touch shortly with the full brochure.',
    placeholderName: 'NAME',
    placeholderWA: 'WHATSAPP *',
    placeholderEmail: 'EMAIL',
    submit: 'Download property brochure',
    sending: 'Sending…',
    privacyDefault: 'I agree to the Privacy Policy',
    privacyLink: 'Privacy Policy',
    subject: 'Brochure request',
  } : {
    successTitle: 'Hemos recibido su solicitud.',
    successDesc: 'En breve nos pondremos en contacto con usted con la memoria completa.',
    placeholderName: 'NOMBRE',
    placeholderWA: 'WHATSAPP *',
    placeholderEmail: 'EMAIL',
    submit: 'Descargar brochure de la propiedad',
    sending: 'Enviando…',
    privacyDefault: 'Acepto la política de privacidad',
    privacyLink: 'política de privacidad',
    subject: 'Solicitud brochure',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('nombre', nombre || '—')
      fd.append('email', email || '—')
      fd.append('whatsapp', whatsapp)
      fd.append('_subject', T.subject)
      fd.append('_captcha', 'false')
      fd.append('_template', 'table')
      await fetch(`https://formsubmit.co/${agentEmail}`, { method: 'POST', body: fd })
    } catch (_) {}
    setLoading(false)
    setSubmitted(true)
    // Autodescarga del brochure al enviar el formulario
    if (brochureUrl) {
      try {
        const a = document.createElement('a')
        a.href = brochureUrl
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
        a.download = ''
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } catch (_) {}
    }
  }

  if (submitted) {
    return (
      <div className={styles.memoriaSuccess} role="status" aria-live="polite">
        <p className={styles.memoriaSuccessTitle}>{T.successTitle}</p>
        <p className={styles.memoriaSuccessDesc}>{T.successDesc}</p>
      </div>
    )
  }

  return (
    <form className={compact ? styles.memoriaFormCompact : styles.memoriaFormWrap} onSubmit={handleSubmit}>
      <div className={styles.memoriaFormRow}>
        <div className={styles.formField}>
          <input className={styles.formInput} type="text" placeholder={T.placeholderName} value={nombre} onChange={e => setNombre(e.target.value)} />
        </div>
        <div className={styles.formField}>
          <input className={styles.formInput} type="tel" placeholder={T.placeholderWA} value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
        </div>
      </div>
      <div className={styles.formField}>
        <input className={styles.formInput} type="email" placeholder={T.placeholderEmail} value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div className={styles.privacidadWrap}>
          <input type="checkbox" className={styles.privacidadCheck} id="privacidad-brochure" />
          <label htmlFor="privacidad-brochure" className={styles.privacidadLabel}>
            {(() => {
              // Extrae "política de privacidad" / "Privacy Policy" del texto y lo convierte en enlace,
              // preservando el resto del copy (incluidos signos de puntuación finales).
              const raw = (privacidadTexto || T.privacyDefault).trim()
              const linkRegex = /(política de privacidad|Privacy Policy)/i
              const m = raw.match(linkRegex)
              if (!privacidadUrl || !m) return raw
              const [before, after] = raw.split(m[0])
              return (
                <>
                  {before}
                  <a href={privacidadUrl} target="_blank" rel="noopener">{m[0]}</a>
                  {after}
                </>
              )
            })()}
          </label>
        </div>
      <button type="submit" className={styles.memoriaBtn} disabled={loading || !canSubmit} style={{ opacity: canSubmit ? 1 : 0.45 }}>
        {loading ? T.sending : <><IconDownload /> {T.submit}</>}
      </button>
    </form>
  )
}
export default function PropertyPage({ data, lang = 'es' }: { data: any, lang?: 'es' | 'en' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', fecha: '' })
  const [calculatorOpen, setCalculatorOpen] = useState<CalculatorType | null>(null)
  const [activeMarker, setActiveMarker] = useState<number>(0)
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const videoTourRef = useRef<HTMLVideoElement | null>(null)
  const pathname = usePathname()
  const navTone = useAdaptiveNavTone(80)
  const navLinks = lang === 'en' ? navLinksEn : navLinksEs

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Marcador activo del video: se recalcula en cada timeupdate
  useEffect(() => {
    const v = videoTourRef.current
    const markers = data?.property?.videoMarkers as any[] | undefined
    if (!v || !markers || markers.length === 0) return
    const secondsOf = (m: any): number => {
      if (typeof m.seconds === 'number') return m.seconds
      const parts = String(m.time || '0:00').split(':').map((n: string) => parseInt(n, 10) || 0)
      return parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0]
    }
    const onTime = () => {
      const t = v.currentTime
      let idx = 0
      for (let i = 0; i < markers.length; i++) {
        if (t + 0.25 >= secondsOf(markers[i])) idx = i
      }
      setActiveMarker(idx)
    }
    v.addEventListener('timeupdate', onTime)
    return () => v.removeEventListener('timeupdate', onTime)
  }, [data])

  const { property, agent } = data
  const waMensaje = encodeURIComponent(
    lang === 'en'
      ? `Hello, I saw the ${property.name} listing and would like more information.`
      : `Hola, vi la propiedad ${property.name} y quiero más información`
  )
  const whatsappUrl = agent.whatsapp ? `https://wa.me/${agent.whatsapp}?text=${waMensaje}` : '#'

  return (
    <div className={styles.page}>
      {calculatorOpen && (
  <CalculatorModal
    type={calculatorOpen}
    onClose={() => setCalculatorOpen(null)}
    defaultPrice={property?.price}
    lang={lang}
  />
)}

      <PageLoader />

      {/* NAVBAR */}
      <nav
        className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}
        data-adaptive-nav
        data-tone={navTone}
      >
        <div className={styles.navInner}>
          <a href="#residencia" className={styles.navLogo}>{property.footerTitulo || 'LARUM STUDIO'}</a>
          <div className={styles.navLinks}>
            {navLinks.map(l => <a key={l.href} href={l.href} className={styles.navLink}>{l.label}</a>)}
          </div>
          <div className={styles.navRight}>
            <LanguageSwitch lang={lang} pathname={pathname || (lang === 'en' ? '/en' : '/')} />
            <LanguageSwitch lang={lang} pathname={pathname || (lang === 'en' ? '/en' : '/')} topbar />
            <a href={whatsappUrl} className={styles.navCta} target="_blank" rel="noopener">{lang === 'en' ? 'Book a Viewing' : 'Agendar Visita'}</a>
            <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? (lang === 'en' ? 'Close menu' : 'Cerrar menú') : (lang === 'en' ? 'Open menu' : 'Abrir menú')}>
              {menuOpen ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map(l => <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>)}
          <LanguageSwitch lang={lang} pathname={pathname || (lang === 'en' ? '/en' : '/')} mobile />
        </div>
      )}

      {/* HERO — CLEAN CENTERED */}
      <section id="residencia" className={styles.hero}>
        {property.videoHero ? (
          <video className={styles.heroBgVideo} autoPlay muted loop playsInline poster={property.posterHero} preload="metadata" key={property.videoHero}>
            <source src={property.videoHero} type="video/mp4" />
          </video>
        ) : (
          <img src={property.posterHero} alt={property.name} className={styles.heroBgVideo} />
        )}
        <div className={styles.heroGradientTB} />
        <div className={styles.heroGradientCenter} />
        <div className={styles.heroCentered}>
          <p className={`${styles.heroCenteredEyebrow} ${styles.heroEnter} ${styles.heroEnter1}`}>{property.location.city}, {property.location.country}</p>
          <h1 className={`${styles.heroCenteredTitle} ${styles.heroEnterMask}`}><span className={styles.heroEnterMaskInner}>{property.heroHeadline || property.name}</span></h1>
          {property.precio && (
            <div className={`${styles.heroCenteredPrice} ${styles.heroEnter} ${styles.heroEnter2}`}>
              <span className={styles.heroCenteredPriceLabel}>PRECIO</span>
              <span className={styles.heroCenteredPriceValue}>{property.precio}</span>
            </div>
          )}
          <div className={`${styles.heroCenteredBtns} ${styles.heroEnter} ${styles.heroEnter3}`}>
            <a href={whatsappUrl} target="_blank" rel="noopener" className={styles.heroCenteredBtnPrimary}>{lang === 'en' ? 'REQUEST A PRIVATE VIEWING' : 'SOLICITAR AGENDA PRIVADA'}</a>
            {property.brochure && (
              <a href="#memoria" className={styles.heroCenteredBtnSecondary}>{lang === 'en' ? 'DOWNLOAD BROCHURE →' : 'DESCARGAR BROCHURE →'}</a>
            )}
          </div>
          <div className={`${styles.heroScrollHint} ${styles.heroEnter} ${styles.heroEnter4}`}>
            <span>SCROLL</span>
            <div className={styles.heroScrollLine} />
          </div>
        </div>
      </section>

      {/* STATS ROW */}
      <RevealSection className={styles.statsRow}>
        <div className={styles.statsRowInner}>
          {[
            { value: property.stats.terreno, label: lang === 'en' ? 'Plot' : 'Terreno' },
            { value: property.stats.construidos, label: lang === 'en' ? 'Built area' : 'Construidos' },
            { value: property.stats.dormitorios, label: lang === 'en' ? 'Bedrooms' : 'Dormitorios' },
            { value: property.stats.banos, label: lang === 'en' ? 'Bathrooms' : 'Baños' },
            { value: property.stats.cocheras || '4', label: lang === 'en' ? 'Garage' : 'Aparcamientos' },
            { value: property.stats.ano || '2018', label: lang === 'en' ? 'Built' : 'Año de Construcción' },
          ].map((st, i) => (
            <div key={i} className={styles.statsRowItem}>
              <div className={styles.statsRowValue}>{st.value}</div>
              <div className={styles.statsRowLabel}>{st.label}</div>
            </div>
          ))}
        </div>
      </RevealSection>


      {/* POSICIONAMIENTO — DOS COLUMNAS ARENA */}
      {property.positioning && (
        <RevealSection className={styles.positioning}>
          <div className={styles.posIntro}>
            <div className={styles.posIntroLeft}>
              <div className={styles.posIntroNum}>
                <span>01</span>
                <span className={styles.posIntroLine} />
                <span className={styles.posIntroLabel}>{lang === 'en' ? 'BECAUSE SOME PLACES ARE NOT CHOSEN. THEY ARE RECOGNISED.' : 'PORQUE ALGUNOS LUGARES NO SE ELIGEN. SE RECONOCEN.'}</span>
              </div>
              <h2 className={styles.posIntroTitle}>
                {property.positioning.paragraphs?.[0]}
              </h2>
              <p className={styles.posIntroItalicLine}>{lang === 'en' ? 'This is one of them.' : 'Esta es una de ellas.'}</p>
            </div>
            <div className={styles.posIntroRight}>
              <p className={styles.posIntroPara}>{lang === 'en'
                ? 'It was not built to be seen. It was built to be lived in. A place where the lake is not scenery, but a constant presence. Where mornings are unhurried and evenings stretch on without end.'
                : 'No fue hecha para ser vista. Fue hecha para ser vivida. Un lugar donde el lago no es paisaje, sino presencia constante. Donde las mañanas no tienen prisa y las noches se extienden sin fin.'}</p>
              <p className={styles.posIntroPara}>{lang === 'en'
                ? 'One does not come here to rest from life. One comes to remember it and reconnect. To dwell in calm, in space, and with the certainty that there is nothing left to prove.'
                : 'Aquí no se viene a descansar de la vida. Se viene a recordarla y a reconectar con ella. A habitar con calma, con espacio y con la certeza de que ya no hay nada que demostrar.'}</p>
              <blockquote className={styles.posQuoteBlock}>
                <p>{lang === 'en'
                  ? '"The truly valuable things are those that are not for sale to just anyone."'
                  : '«Las cosas verdaderamente valiosas son aquellas que no están a la venta para cualquiera.»'}</p>
              </blockquote>
            </div>
          </div>
        </RevealSection>
      )}


      {/* STORY (renderizado desde JSON) */}
      <RevealSection className={styles.story} id="narrativa">
        <div className={styles.storyInner}>
          <div className={styles.storyLeft}>
            <p className={styles.eyebrow}>{lang === 'en' ? 'The Story' : 'La Historia'}</p>
            <h2 className={styles.storyTitle}>{property.story?.title}</h2>
            {property.story?.paragraphs?.map((p: string, i: number) => (
              <p key={i} className={styles.storyDesc} style={i > 0 ? { marginTop: '1.25rem' } : {}}>{p}</p>
            ))}
          </div>
          <div className={styles.storyRight}>
            <div className={styles.storyImgWrap}>
              <img loading="lazy" src={property.story?.image || property.posterHero} alt={property.story?.title || property.name} className={styles.storyImg} />
            </div>
          </div>
        </div>
      </RevealSection>

      {/* VIDEO DESTACADO */}
      {property.videoPresentacion && (
        <RevealSection className={styles.videoFeature} id="video-tour">
          <div className={styles.videoFeatureInner}>
            <div className={styles.videoFeatureHeader}>
              <p className={styles.eyebrow}>{lang === 'en' ? 'Tour' : 'Recorrido'}</p>
              <h2 className={styles.videoFeatureTitle}>{lang === 'en' ? 'Walk through every room.' : 'Conozca la residencia.'}</h2>
            </div>
            <div className={styles.videoFeatureFrame}>
              <div className={styles.videoCornerTL} /><div className={styles.videoCornerTR} />
              <div className={styles.videoCornerBL} /><div className={styles.videoCornerBR} />
              <video
                ref={videoTourRef}
                className={styles.videoFeatureEl}
                controls
                poster="https://larumstudio.com/wp-content/uploads/2026/04/unnamed-1.webp"
                preload="metadata"
                key={property.videoPresentacion}
              >
                <source src={property.videoPresentacion} type="video/mp4" />
              </video>
              <div className={styles.videoFeatureMeta}>
                <span className={styles.videoFeatureLabel}>
                  {lang === 'en'
                    ? `Full tour · 4K · ${(property.videoDuration || '1:38').replace(/^(\d+):(\d+)$/, '$1 min $2 sec')}`
                    : `Recorrido completo · 4K · ${(property.videoDuration || '1:23').replace(/^(\d+):(\d+)$/, '$1 min $2 s')}`}
                </span>
              </div>
            </div>
            {property.videoMarkers && property.videoMarkers.length > 0 && (
              <div
                className={styles.videoMarkers}
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${property.videoMarkers.length}, minmax(0, 1fr))`,
                  gap: '0.5rem',
                }}
              >
                {property.videoMarkers.map((m: any, i: number) => {
                  const seconds = typeof m.seconds === 'number'
                    ? m.seconds
                    : (() => {
                        const parts = String(m.time || '0:00').split(':').map((n: string) => parseInt(n, 10) || 0);
                        return parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0];
                      })();
                  const active = activeMarker === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      className={styles.videoMarker}
                      aria-label={`${lang === 'en' ? 'Go to' : 'Ir a'} ${m.time} — ${m.label}`}
                      aria-current={active ? 'true' : undefined}
                      onClick={() => {
                        const v = videoTourRef.current;
                        if (!v) return;
                        v.currentTime = seconds;
                        v.play().catch(() => {});
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        padding: 0,
                        opacity: active ? 1 : 0.75,
                      }}
                    >
                      <span className={styles.videoMarkerTime}>{m.time}</span>
                      <span className={styles.videoMarkerLabel}>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </RevealSection>
      )}

      {/* FEATURES (renderizado desde JSON) */}
      <RevealSection className={styles.features}>
        <div className={styles.featuresInner}>
          <p className={styles.eyebrow}>{property.featuresGrid?.eyebrow || (lang === 'en' ? 'Why this house, and not another' : 'Por qué esta casa, y no otra')}</p>
          <h2 className={styles.sectionTitleH2}>{property.featuresGrid?.title || (lang === 'en' ? 'The place you choose when you have stopped looking' : 'El lugar que se elige cuando ya no se busca más')}</h2>
          <div className={styles.featuresGrid}>
            {(property.featuresGrid?.items || []).map((f: any, i: number) => (
              <div key={i} className={styles.featureItem}>
                <div className={styles.featureIcon}>{featureIconByName[f.icono] || featureIcons[i] || featureIcons[0]}</div>
                <h4 className={styles.featureTitle}>{f.title}</h4>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* GALLERY PREVIEW */}
      <RevealSection className={styles.gallerySection} id="galeria">
        <div className={styles.galleryInner}>
          <div className={styles.galleryHeader}>
            <div>
              <p className={styles.eyebrow}>{lang === 'en' ? 'Gallery' : 'Galería'}</p>
              <h2 className={styles.galleryTitle}>{lang === 'en' ? 'Spaces that speak before you do.' : 'Momentos para enamorarse.'}</h2>
              <p className={styles.gallerySubtitle}>{lang === 'en' ? 'A visual sequence that follows the natural rhythm of the property — impact, atmosphere and detail.' : 'Una secuencia visual que sigue el recorrido natural de la propiedad: impacto, atmósfera y detalle.'}</p>
            </div>
          </div>
          {property.gallery && property.gallery.length > 0 && (
            <div className={styles.galleryPreviewLayout}>
              <div className={styles.galleryHeroImg}>
                {/* Cambio 6: Forzar carga de primera imagen con URL directa si falla */}
                {property.gallery[0].isVideo ? (
                  <video src={property.gallery[0].url} autoPlay muted loop playsInline />
                ) : (
                  <img 
                    loading="lazy" 
                    src={property.gallery[0].url || 'https://larumstudio.com/wp-content/uploads/2026/04/unnamed-1.webp'} 
                    alt={property.gallery[0].caption}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== 'https://larumstudio.com/wp-content/uploads/2026/04/unnamed-1.webp') {
                        target.src = 'https://larumstudio.com/wp-content/uploads/2026/04/unnamed-1.webp';
                      }
                    }}
                  />
                )}
                <div className={styles.galCaption}>{property.gallery[0].caption}</div>
              </div>
              <div className={styles.galleryThumbRow}>
                {property.gallery.slice(1, 5).map((img: any, i: number) => (
                  <div key={i} className={styles.galleryThumb} onClick={() => setPreviewIndex(i)}>
                    {img.isVideo ? (
                      <video src={img.url} autoPlay muted loop playsInline poster={property.gallery[0]?.url} />
                    ) : (
                      <img loading="lazy" src={img.url} alt={img.caption} />
                    )}
                  </div>
                ))}
              </div>
              <div className={styles.galleryCta}>
                <button className={styles.galleryMoreBtn} onClick={() => setGalleryOpen(true)}>
                  {lang === 'en' ? 'View full gallery' : 'Ver galería completa'} <IconArrow />
                </button>
              </div>
            </div>
          )}
        </div>
      </RevealSection>

      {/* SIDE PANEL GALERÍA */}
      {galleryOpen && (
        <div className={styles.galleryPanel} onClick={() => setGalleryOpen(false)}>
          <div className={styles.galleryPanelInner} onClick={e => e.stopPropagation()}>
            <div className={styles.galleryPanelHeader}>
              <p className={styles.galleryPanelTitle}>{lang === 'en' ? `Full gallery · ${property.gallery.length} images` : `Galería completa · ${property.gallery.length} imágenes`}</p>
              <button className={styles.galleryPanelClose} onClick={() => setGalleryOpen(false)}><IconClose /></button>
            </div>
            <div className={styles.galleryPanelGrid}>
              {property.gallery.map((img: any, i: number) => (
                <div key={i} className={styles.galleryPanelItem} onClick={() => setLightboxIndex(i)}>
                  <div className={styles.galleryPanelImgWrap}>
                    {img.isVideo ? (
                      <video src={img.url} autoPlay muted loop playsInline />
                    ) : (
                      <img loading="lazy" src={img.url} alt={img.caption} />
                    )}
                  </div>
                  {img.caption && <p className={styles.galleryPanelCaption}>{img.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightboxIndex !== null && (
        <div className={styles.lightbox} onClick={() => setLightboxIndex(null)}>
          <button className={styles.lightboxClose} onClick={() => setLightboxIndex(null)}><IconClose /></button>
          <button className={styles.lightboxPrev} onClick={e => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + property.gallery.length) % property.gallery.length) }}>←</button>
          <div className={styles.lightboxImgWrap} onClick={e => e.stopPropagation()}>
            <img loading="lazy" src={property.gallery[lightboxIndex].url} alt={property.gallery[lightboxIndex].caption} />
            {property.gallery[lightboxIndex].caption && <p className={styles.lightboxCaption}>{property.gallery[lightboxIndex].caption}</p>}
          </div>
          <button className={styles.lightboxNext} onClick={e => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % property.gallery.length) }}>→</button>
        </div>
      )}

      {/* LIGHTBOX PREVIEW */}
      {previewIndex !== null && (() => {
        const previewImgs = property.gallery.slice(1, 5)
        const isCtaSlide = previewIndex >= previewImgs.length
        return (
          <div className={styles.lightbox} onClick={() => setPreviewIndex(null)}>
            <button className={styles.lightboxClose} onClick={() => setPreviewIndex(null)}><IconClose /></button>
            {previewIndex > 0 && <button className={styles.lightboxPrev} onClick={e => { e.stopPropagation(); setPreviewIndex(previewIndex - 1) }}>←</button>}
            {isCtaSlide ? (
              <div className={styles.lightboxCtaSlide} onClick={e => e.stopPropagation()}>
                <p className={styles.lightboxCtaEyebrow}>{lang === 'en' ? 'There is much more to discover' : 'Hay mucho más por descubrir'}</p>
                <h3 className={styles.lightboxCtaTitle}>{lang === 'en' ? `${property.gallery.length} moments in total` : `${property.gallery.length} momentos en total`}</h3>
                <button className={styles.lightboxCtaBtn} onClick={() => { setPreviewIndex(null); setGalleryOpen(true) }}>
                  {lang === 'en' ? 'View full gallery' : 'Ver galería completa'} <IconArrow />
                </button>
              </div>
            ) : (
              <div className={styles.lightboxImgWrap} onClick={e => e.stopPropagation()}>
                {previewImgs[previewIndex].isVideo ? (
                  <video src={previewImgs[previewIndex].url} autoPlay muted loop playsInline controls />
                ) : (
                  <img loading="lazy" src={previewImgs[previewIndex].url} alt={previewImgs[previewIndex].caption} />
                )}
                {previewImgs[previewIndex].caption && <p className={styles.lightboxCaption}>{previewImgs[previewIndex].caption}</p>}
              </div>
            )}
            {!isCtaSlide && <button className={styles.lightboxNext} onClick={e => { e.stopPropagation(); setPreviewIndex(previewIndex + 1) }}>→</button>}
          </div>
        )
      })()}

      {/* AMENITIES — con categorías BIENESTAR / EXTERIOR / SERVICIOS */}
      {property.amenities && property.amenities.length > 0 && (() => {
        const cats = property.amenitiesCategorias
        const catLabels: Record<string, { es: string, en: string }> = {
          bienestar: { es: 'BIENESTAR', en: 'WELLNESS' },
          exterior:  { es: 'EXTERIOR',  en: 'OUTDOORS' },
          servicios: { es: 'SERVICIOS', en: 'SERVICES' },
        }
        const groups = cats
          ? (['bienestar','exterior','servicios'] as const)
              .filter(k => Array.isArray(cats[k]) && cats[k].length > 0)
              .map(k => ({ key: k, label: catLabels[k][lang], items: cats[k] as string[] }))
          : [{ key: 'all', label: lang === 'en' ? 'AMENITIES' : 'COMODIDADES', items: property.amenities as string[] }]
        return (
          <RevealSection className={styles.amenities} id="amenities">
            <div className={styles.amenitiesLeft}>
              <p className={styles.eyebrow}>{lang === 'en' ? 'Amenities' : 'Comodidades'}</p>
              <h2 className={styles.amenitiesTitle}>{lang === 'en' ? 'Every comfort, considered.' : 'Bienestar en cada detalle.'}</h2>
              <p className={styles.amenitiesDesc}>{lang === 'en' ? 'Spaces designed for family life, for entertaining with ease, and for genuine rest in complete comfort.' : 'Espacios diseñados para disfrutar en familia, recibir con elegancia y relajarse en completo confort.'}</p>
              <div className={styles.amenitiesCategoriasWrap}>
                {groups.map((g) => (
                  <div key={g.key} className={styles.amenitiesCategoria}>
                    <div className={styles.amenitiesCatHeader}>
                      <span className={styles.amenitiesCatLabel}>{g.label}</span>
                      <span className={styles.amenitiesCatCount}>{String(g.items.length).padStart(2, '0')}</span>
                    </div>
                    <div className={styles.amenitiesIcons}>
                      {g.items.map((key: string, i: number) => {
                        const label = amenityLabel(key, lang)
                        const iconKey = key.toUpperCase()
                        return (
                          <div key={i} className={styles.amenityItem}>
                            <div className={styles.amenityIcon}>{amenityIcons[iconKey] || amenityIcons[key] || defaultIcon}</div>
                            <span className={styles.amenityLabel}>{label}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.amenitiesRight}>
              <img loading="lazy" src={property.amenitiesImage || property.posterHero} alt="Amenities" />
              <div className={styles.amenitiesImgOverlay} />
            </div>
          </RevealSection>
        )
      })()}

      {/* UN DÍA EN ESTA CASA — timeline */}
      {property.unDiaEnCasa && property.unDiaEnCasa.length > 0 && (
        <RevealSection className={styles.unDiaEnCasa} id="un-dia">
          <div className={styles.unDiaInner}>
            <div className={styles.unDiaHeader}>
              <p className={styles.eyebrow}>{lang === 'en' ? 'A day in this house' : 'Un día en esta casa'}</p>
              <h2 className={styles.unDiaTitle}>
                {lang === 'en'
                  ? 'Six moments that tell you everything.'
                  : 'Del primer amanecer al final del día.'}
              </h2>
              <p className={styles.unDiaSubtitle}>
                {lang === 'en'
                  ? 'Six moments that show what living here actually feels like.'
                  : 'Seis momentos que reflejan lo que significa vivir aquí.'}
              </p>
            </div>
            <div className={styles.unDiaGrid}>
              {property.unDiaEnCasa.map((m: any, i: number) => (
                <article key={i} className={styles.unDiaCard}>
                  <div className={styles.unDiaCardImg}>
                    <img loading="lazy" src={m.imagen} alt={m.titulo} />
                  </div>
                  <div className={styles.unDiaCardBody}>
                    <span className={styles.unDiaHora}>{m.hora}</span>
                    <h3 className={styles.unDiaCardTitle}>{m.titulo}</h3>
                    <p className={styles.unDiaCardDesc}>{m.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </RevealSection>
      )}

      {/* LIFESTYLE / ENTORNO */}
      {property.lifestyle && (
        <RevealSection className={styles.lifestyle} id="entorno">
          <div className={styles.lifestyleInner}>
            <div className={styles.lifestyleTop}>
              <div className={styles.lifestyleHeroImg}>
                <img loading="lazy" src={property.lifestyle.image || property.lifestyleImage || property.posterHero} alt={property.lifestyle.title} />
              </div>
              <div className={styles.lifestyleHeader}>
                <p className={styles.eyebrow}>{property.lifestyle.eyebrow}</p>
                <h2 className={styles.lifestyleTitle}>{property.lifestyle.title}</h2>
                {(property.lifestyle.introParagraphs || [property.lifestyle.intro]).filter(Boolean).map((para: string, i: number) => (
                  <p key={i} className={styles.lifestyleIntro} style={i > 0 ? { marginTop: '1.25rem' } : {}}>{para}</p>
                ))}
               <a href={lang === 'en' ? '/en/area' : '/entorno'} className={styles.locationBtnSecondary}>
  {lang === 'en' ? 'Discover San Bernardino →' : 'Descubra San Bernardino →'}
</a>
              </div>
            </div>
            <div className={styles.lifestyleGrid}>
              {property.lifestyle.items.map((it: any, i: number) => (
                <div key={i} className={styles.lifestyleCard}>
                  <span className={styles.lifestyleNum}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 className={styles.lifestyleCardTitleBig}>{it.title}</h3>
                  <p className={styles.lifestyleCardDesc}>{it.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      )}

      {/* FULL BLEED BREAK 1 - Cambio 8: imagen de mayor resolución */}
      <FullBleedBreak src="https://larumstudio.com/wp-content/uploads/2026/07/Piscina-2560px-upscaled.webp" caption="Villa San Bernardino" />

      {/* UBICACIÓN */}
      <RevealSection className={styles.location} id="ubicacion">
        <div className={styles.locationInner}>
          <div className={styles.locationLeft}>
            <p className={styles.eyebrow}>{lang === 'en' ? 'Location' : 'Ubicación'}</p>
            <h2 className={styles.locationTitle}>{property.location.city}</h2>
            {/* Cambio 2: Eliminada la descripción de ubicación */}
            {property.location.landmarks && property.location.landmarks.length > 0 && (
              <div className={styles.landmarksList}>
                <p className={styles.landmarksNearby}>{lang === 'en' ? 'POINTS OF INTEREST' : 'PUNTOS DE INTERÉS'}</p>
                <div className={styles.landmarksCols}>
                  <div className={styles.landmarksCol}>
                    {property.location.landmarks.slice(0, Math.ceil(property.location.landmarks.length / 2)).map((lm: any, i: number) => {
                      const name = getLandmarkName(lm)
                      const detail = getLandmarkDetail(lm)
                      const minutes = getLandmarkMinutes(lm)
                      return (
                        <div key={i} className={styles.landmarkRow}>
                          <div className={styles.landmarkRowIcon}>{getLandmarkIcon(lm)}</div>
                          <span className={styles.landmarkRowName}>{name}</span>
                          <span className={styles.landmarkRowTime}>{detail}{minutes ? ` · ${minutes} min` : ''}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className={styles.landmarksCol}>
                    {property.location.landmarks.slice(Math.ceil(property.location.landmarks.length / 2)).map((lm: any, i: number) => {
                      const name = getLandmarkName(lm)
                      const detail = getLandmarkDetail(lm)
                      const minutes = getLandmarkMinutes(lm)
                      return (
                        <div key={i} className={styles.landmarkRow}>
                          <div className={styles.landmarkRowIcon}>{getLandmarkIcon(lm)}</div>
                          <span className={styles.landmarkRowName}>{name}</span>
                          <span className={styles.landmarkRowTime}>{detail}{minutes ? ` · ${minutes} min` : ''}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
            <div className={styles.locationBtns}>
            </div>
          </div>
          <div className={styles.locationRight}>
            <div className={styles.locationMap}>
              {property.location.mapImage ? (
                <>
                  <img loading="lazy" src={property.location.mapImage} alt={property.location.city} className={styles.mapPhoto} />
                  <div className={styles.mapPhotoOverlay} />
                </>
              ) : (
                <svg className={styles.mapGrid} preserveAspectRatio="none">
                  <defs><pattern id="gridP" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="#ffffff" strokeWidth="0.4" /></pattern></defs>
                  <rect width="100%" height="100%" fill="url(#gridP)" />
                </svg>
              )}
            </div>
            {property.location.mapsUrl && (
              <div className={styles.locationMapBtn}>
                <a href={property.location.mapsUrl} target="_blank" rel="noopener" className={styles.locationBtn}>{lang === 'en' ? 'Open in Maps' : 'Descubrir en el Mapa'}</a>
              </div>
            )}
          </div>
        </div>
      </RevealSection>

      {/* PLANO - Cambio 3: textos aspiracionales */}
      {property.floorPlan && property.floorPlan.areas && property.floorPlan.areas.length > 0 && (
        <RevealSection className={styles.plano} id="plano">
          <div className={styles.planoInner}>
            <div className={styles.planoHeader}>
              <p className={styles.eyebrow}>{lang === 'en' ? 'A layout that makes sense' : 'Un recorrido con sentido'}</p>
              <h2 className={styles.planoTitleTop}>{lang === 'en' ? 'Where every space has its reason.' : 'Donde cada espacio encuentra su razón de ser.'}</h2>
            </div>
            <div className={styles.planoTwoCol}>
              {property.floorPlan.image && (
                <div className={styles.planoImgCol}><img loading="lazy" src={property.floorPlan.image} alt={lang === 'en' ? 'Floor plan' : 'Plano'} /></div>
              )}
              <div className={styles.planoTableCol}>
                <table className={styles.areaTable}>
                  <thead><tr><th>{lang === 'en' ? 'Room' : 'Ambiente'}</th><th>{lang === 'en' ? 'Approx. area' : 'Superficie aprox.'}</th></tr></thead>
                  <tbody>
                    {property.floorPlan.areas.map((a: any, i: number) => (
                      <tr key={i}><td>{a.ambiente}</td><td>{a.superficie}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </RevealSection>
      )}

      {/* GASTOS RECURRENTES */}
      {property.gastos && property.gastos.length > 0 && (
        <RevealSection className={styles.gastosSection}>
          <div className={styles.gastosInner}>
            <div style={{ marginBottom: '2rem' }}>
              <p className={styles.eyebrow}>{lang === 'en' ? 'Estimated running costs' : 'Gastos estimados'}</p>
            </div>
            <div className={styles.gastosGrid}>
              {property.gastos.map((g: any, i: number) => (
                <div key={i} className={styles.gastoItem}>
                  <div className={styles.gastoIconWrap}>{gastoIcons[g.icono] || gastoIcons['otro']}</div>
                  <div className={styles.gastoInfo}>
                    <span className={styles.gastoConcepto}>{g.concepto}</span>
                    <span className={styles.gastoValor}>{g.valor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      )}

      {/* EL VALOR ESTÁ EN LO INVISIBLE — detalles técnicos por categoría */}
      {property.loQueNoSeVe && property.loQueNoSeVe.length > 0 && (
        <RevealSection className={styles.invisible} id="invisible">
          <div className={styles.invisibleInner}>
            <div className={styles.invisibleHeader}>
              <p className={styles.eyebrow}>{lang === 'en' ? 'Detail and craftsmanship' : 'Detalle y factura'}</p>
              <h2 className={styles.invisibleTitle}>
                {lang === 'en' ? 'The value lies in what you cannot see.' : 'El valor está en lo invisible.'}
              </h2>
              <p className={styles.invisibleSubtitle}>
                {lang === 'en'
                  ? 'Materials, systems and specifications that hold their value over time.'
                  : 'Materiales, sistemas y especificaciones que sostienen el valor con el paso del tiempo.'}
              </p>
            </div>
            <div className={styles.invisibleGrid}>
              {property.loQueNoSeVe.map((cat: any, i: number) => (
                <div key={i} className={styles.invisibleCol}>
                  <div className={styles.invisibleColHeader}>
                    <span className={styles.invisibleNum}>{String(i + 1).padStart(2, '0')}</span>
                    <h3 className={styles.invisibleColTitle}>{cat.categoria}</h3>
                  </div>
                  <ul className={styles.invisibleList}>
                    {cat.items.map((it: string, j: number) => (
                      <li key={j} className={styles.invisibleListItem}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      )}

      {/* DIA Y NOCHE — una villa diseñada para brillar */}
      {property.diaNoche && (property.diaNoche.imagenDia || property.diaNoche.videoTransicion) && (
        <RevealSection className={styles.diaNoche} id="dia-noche">
          <div className={styles.diaNocheInner}>
            <div className={styles.diaNocheHeader}>
              <p className={styles.eyebrow}>{lang === 'en' ? 'Light through the day' : 'La luz de cada hora'}</p>
              <h2 className={styles.diaNocheTitle}>
                {lang === 'en'
                  ? 'A villa that looks just as striking after dark.'
                  : 'Una villa diseñada para brillar.'}
              </h2>
              <p className={styles.diaNocheDesc}>{property.diaNoche.descripcion}</p>
            </div>
            <div className={styles.diaNocheMediaWrap}>
              {property.diaNoche.videoTransicion ? (
                <video
                  className={styles.diaNocheVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={property.diaNoche.imagenDia}
                  preload="metadata"
                >
                  <source src={property.diaNoche.videoTransicion} type="video/mp4" />
                </video>
              ) : (
                <div className={styles.diaNocheImgPair}>
                  <img loading="lazy" src={property.diaNoche.imagenDia} alt={lang === 'en' ? 'By day' : 'De día'} />
                  <img loading="lazy" src={property.diaNoche.imagenNoche} alt={lang === 'en' ? 'By night' : 'De noche'} />
                </div>
              )}
              <div className={styles.diaNocheLabels}>
                <span>{lang === 'en' ? 'By day' : 'De día'}</span>
                <span>{lang === 'en' ? 'By night' : 'De noche'}</span>
              </div>
            </div>
          </div>
        </RevealSection>
      )}

      {/* INVERSIÓN Y LEGADO */}
      {property.inversion && (
        <RevealSection className={styles.inversion} id="inversion">
          <div className={styles.inversionInner}>
            <div className={styles.inversionHeader}>
              <p className={styles.eyebrow}>{property.inversion.eyebrow || (lang === 'en' ? 'Investment and legacy' : 'Inversión y legado')}</p>
              <h2 className={styles.inversionTitle}>{property.inversion.titulo}</h2>
              <p className={styles.inversionDesc}>{property.inversion.descripcion}</p>
            </div>
            {property.inversion.datos && property.inversion.datos.length > 0 && (
              <div className={styles.inversionGrid}>
                {property.inversion.datos.map((d: any, i: number) => (
                  <div key={i} className={styles.inversionCard}>
                    <span className={styles.inversionCardLabel}>{d.label}</span>
                    <span className={styles.inversionCardValue}>{d.valor}</span>
                    <span className={styles.inversionCardTrend}>{d.tendencia}</span>
                  </div>
                ))}
              </div>
            )}
            {property.inversion.plusvalia && (
              <div className={styles.inversionPlusvalia}>
                <h3 className={styles.inversionPlusvaliaTitle}>{property.inversion.plusvalia.titulo}</h3>
                <p className={styles.inversionPlusvaliaDesc}>{property.inversion.plusvalia.descripcion}</p>
              </div>
            )}
          </div>
        </RevealSection>
      )}

      {/* RECURSOS — GARANTÍAS + DESCARGABLES + CALCULADORAS */}
      <RevealSection className={styles.trustDocsSection}>
        <div className={styles.trustDocsHeader}>
          <p className={styles.eyebrow}>{lang === 'en' ? 'Resources' : 'Recursos'}</p>
          <h2 className={styles.sectionTitle}>{lang === 'en' ? 'Everything you need to evaluate the residence with clarity.' : 'Todo lo que necesita para evaluar la residencia con criterio.'}</h2>
        </div>
        <div className={styles.trustDocsCols}>
          {/* COL 1: GARANTÍAS — ACCORDION */}
            <div className={styles.trustDocsCol}>
              <h3 className={styles.trustDocsColTitle}>{lang === 'en' ? 'Purchase assurances' : 'Garantías'}</h3>
              <div className={styles.garantiaAccordion}>
                {(property.trust || []).map((item: string, i: number) => (
                  <details key={i} className={styles.garantiaAccItem}>
                    <summary className={styles.garantiaAccSummary}>
                      <span className={styles.garantiaAccCheck}><IconCheck /></span>
                      <span className={styles.garantiaAccLabel}>{item}</span>
                      <span className={styles.garantiaAccChevron}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M6 9l6 6 6-6"/></svg>
                      </span>
                    </summary>
                    <div className={styles.garantiaAccBody}>
                      <p>{lang === 'en' ? 'Verified and documented as part of a fully supported purchase process.' : 'Verificado y documentado como parte de un proceso de compra transparente y acompañado.'}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          {/* COL 2: DESCARGABLES - Cambio 4: URLs reales */}
          <div className={styles.trustDocsCol}>
            <h3 className={styles.trustDocsColTitle}>{lang === 'en' ? 'Documentation' : 'Documentación'}</h3>
            <div className={styles.descargablesStackV}>
              {property.descargables && property.descargables.length > 0 ? (
                property.descargables.map((d: any, i: number) => (
                  <a key={i} href={d.url} target="_blank" rel="noopener" className={styles.descargableRow}>
                    <span className={styles.descargableRowNum}>{String(i + 1).padStart(2, '0')}</span>
                    <div className={styles.descargableRowInfo}>
                      <span className={styles.descargableRowTitle}>
                        {d.titulo}
                        {lang === 'en' && d.idiomaArchivo === 'es' && d.tipo !== 'qr' && (
                          <span className={styles.docLangBadge}>Spanish version</span>
                        )}
                      </span>
                      {d.detalle && <span className={styles.descargableRowDetail}>{d.detalle}</span>}
                    </div>
                    <span className={styles.descargableRowIcon}><IconDownload /></span>
                  </a>
                ))
              ) : (
                <>
                  <a href="https://larumstudio.com/wp-content/uploads/2026/07/planos-villa-san-bernardino_compressed.pdf" target="_blank" rel="noopener" className={styles.descargableRow}>
                    <span className={styles.descargableRowNum}>01</span>
                    <div className={styles.descargableRowInfo}><span className={styles.descargableRowTitle}>Planos de distribución</span></div>
                    <span className={styles.descargableRowIcon}><IconDownload /></span>
                  </a>
                  <a href="https://larumstudio.com/wp-content/uploads/2026/07/Certificado_Eficiencia_Energetica_Villa_San_Bernardino_compressed.pdf" target="_blank" rel="noopener" className={styles.descargableRow}>
                    <span className={styles.descargableRowNum}>02</span>
                    <div className={styles.descargableRowInfo}><span className={styles.descargableRowTitle}>Certificación energética</span></div>
                    <span className={styles.descargableRowIcon}><IconDownload /></span>
                  </a>
                                    <a href="https://larumstudio.com/wp-content/uploads/2026/07/Ficha_Tecnica_Villa_San_Bernardino_compressed.pdf" target="_blank" rel="noopener" className={styles.descargableRow}>
                    <span className={styles.descargableRowNum}>03</span>
                    <div className={styles.descargableRowInfo}><span className={styles.descargableRowTitle}>Ficha técnica</span></div>
                    <span className={styles.descargableRowIcon}><IconDownload /></span>
                  </a>
                  <a href="https://larumstudio.com/wp-content/uploads/2026/07/qr-code.png" target="_blank" rel="noopener" download className={styles.descargableRow}>
                    <span className={styles.descargableRowNum}>04</span>
                    <div className={styles.descargableRowInfo}><span className={styles.descargableRowTitle}>Código QR para compartir</span></div>
                    <span className={styles.descargableRowIcon}><IconDownload /></span>
                  </a>
                </>
              )}
            </div>
          </div>
          {/* COL 3: CALCULADORAS */}
          <div className={styles.trustDocsCol}>
            <h3 className={styles.trustDocsColTitle}>{lang === 'en' ? 'Calculators' : 'Calculadoras'}</h3>
            <div className={styles.calcGrid}>
             <button
  type="button"
  className={styles.calcCard}
  onClick={() => setCalculatorOpen('mortgage')}
>
                <div className={styles.calcIconWrap}>
                  <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h2M14 10h2M8 14h2M14 14h2M8 18h2M14 18h2"/></svg>
                </div>
                <span className={styles.calcLabel}>{lang === 'en' ? 'Estimate your mortgage →' : 'Calcule su hipoteca →'}</span>
                <span className={styles.calcArrow}>→</span>
              </button>
              <button
  type="button"
  className={styles.calcCard}
  onClick={() => setCalculatorOpen('purchase')}
>
                <div className={styles.calcIconWrap}>
                  <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M9 22V12h6v10"/></svg>
                </div>
                <span className={styles.calcLabel}>{lang === 'en' ? 'Estimate your acquisition costs →' : 'Calcule los costes de adquisición →'}</span>
                <span className={styles.calcArrow}>→</span>
              </button>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* POTENCIAL DE RENTA — bloque orientativo directamente debajo de calculadoras */}
      <RevealSection className={styles.potencialRenta} id="potencial-renta">
        <div className={styles.potencialRentaInner}>
          <div className={styles.potencialRentaHeader}>
            <p className={styles.eyebrow}>{lang === 'en' ? 'Rental potential' : 'Potencial de renta'}</p>
            <h2 className={styles.potencialRentaTitle}>
              {lang === 'en'
                ? 'A residence with year-round rental demand.'
                : 'Una residencia con demanda de alquiler durante todo el año.'}
            </h2>
            <p className={styles.potencialRentaDesc}>
              {lang === 'en'
                ? 'A first read on how the residence performs as a residential asset. Figures are indicative and should be validated with a current local market report.'
                : 'Una primera lectura sobre el comportamiento de la residencia como activo. Las cifras son orientativas y deben validarse con un informe de mercado local actualizado.'}
            </p>
          </div>
          <div className={styles.potencialRentaGrid}>
            <div className={styles.potencialRentaCard}>
              <span className={styles.potencialRentaLabel}>{lang === 'en' ? 'Long-term lease (annual)' : 'Alquiler de larga estancia (anual)'}</span>
              <span className={styles.potencialRentaValue}>{lang === 'en' ? 'USD 3,500 – 5,500 / month' : 'USD 3.500 – 5.500 / mes'}</span>
              <span className={styles.potencialRentaNote}>{lang === 'en' ? 'Furnished, full-year lease to a qualified tenant.' : 'Amueblada, contrato anual con inquilino cualificado.'}</span>
            </div>
            <div className={styles.potencialRentaCard}>
              <span className={styles.potencialRentaLabel}>{lang === 'en' ? 'Peak season (December – February)' : 'Temporada alta (diciembre – febrero)'}</span>
              <span className={styles.potencialRentaValue}>{lang === 'en' ? 'USD 800 – 1,200 / night' : 'USD 800 – 1.200 / noche'}</span>
              <span className={styles.potencialRentaNote}>{lang === 'en' ? 'Short lets during Paraguayan summer, subject to concierge management.' : 'Estancias cortas durante el verano paraguayo, sujetas a gestión con conserjería.'}</span>
            </div>
            <div className={styles.potencialRentaCard}>
              <span className={styles.potencialRentaLabel}>{lang === 'en' ? 'Corporate & events' : 'Corporativo y eventos'}</span>
              <span className={styles.potencialRentaValue}>{lang === 'en' ? 'On request' : 'A consultar'}</span>
              <span className={styles.potencialRentaNote}>{lang === 'en' ? 'Private retreats and off-site events for teams up to twenty guests.' : 'Retiros privados y eventos corporativos para grupos de hasta veinte personas.'}</span>
            </div>
          </div>
          <p className={styles.potencialRentaDisclaimer}>
            {lang === 'en'
              ? 'Indicative figures based on comparable operations in the area. Actual performance depends on occupancy, management model, seasonality and tax structure. We can share a full market report on request.'
              : 'Cifras orientativas basadas en operaciones comparables en la zona. El rendimiento real depende de la ocupación, el modelo de gestión, la estacionalidad y la estructura fiscal. Podemos compartir un informe de mercado detallado a solicitud.'}
          </p>
        </div>
      </RevealSection>

      {/* FAQ — La confianza comienza antes de la visita */}
      {property.faq && property.faq.length > 0 && (
        <RevealSection className={styles.faqSection} id="faq">
          <div className={styles.faqInner}>
            <div className={styles.faqHeader}>
              <p className={styles.eyebrow}>{lang === 'en' ? 'Frequently asked' : 'Preguntas frecuentes'}</p>
              <h2 className={styles.faqTitle}>{property.faqTitulo}</h2>
              {property.faqSubtitulo && (
                <p className={styles.faqSubtitle}>{property.faqSubtitulo}</p>
              )}
            </div>
            <div className={styles.faqList}>
              {property.faq.map((q: any, i: number) => (
                <details key={i} className={styles.faqItem}>
                  <summary className={styles.faqSummary}>
                    <span className={styles.faqNum}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={styles.faqQuestion}>{q.pregunta}</span>
                    <span className={styles.faqChevron}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.3}><path d="M6 9l6 6 6-6"/></svg>
                    </span>
                  </summary>
                  <div className={styles.faqAnswer}><p>{q.respuesta}</p></div>
                </details>
              ))}
            </div>
          </div>
        </RevealSection>
      )}

      {/* BROCHURE - Cambio 7: QR actualizado */}
      <RevealSection className={styles.memoria} id="memoria">
        <div className={styles.memoriaBalanced}>
          <div className={styles.memoriaBalancedLeft}>
            <p className={styles.eyebrow}>{lang === 'en' ? 'Documentation' : 'Documentación'}</p>
            <h2 className={styles.memoriaTitle}>{lang === 'en' ? 'The residence memoir.' : 'Memoria de la Residencia.'}</h2>
            <p className={styles.memoriaDesc}>{lang === 'en' ? (<>Not a brochure.<br />A private document, prepared with care and discretion, that gathers the essence of this property: its history, its context, the materials and details that genuinely matter, and a visual narrative that allows the residence to be understood in depth.</>) : (<>No es un catálogo.<br />Es un documento privado, elaborado con criterio y discreción, que reúne la esencia de esta propiedad: su historia, su contexto, los materiales y detalles que realmente importan, y una narrativa visual que permite comprenderla en profundidad.</>)}</p>
            <p className={styles.memoriaDesc}>{lang === 'en' ? 'Designed for those who evaluate seriously before visiting. A resource that can be shared with family, partners or advisors, conveying the real experience of the residence before setting foot inside.' : 'Diseñado para quienes evalúan con seriedad antes de visitar. Un material que puede compartirse con familia, socios o asesores, y que transmite la verdadera experiencia de la residencia antes de pisarla.'}</p>
            <p className={styles.memoriaMetaInline}>{lang === 'en' ? 'Private document · Exclusive PDF · Sent immediately' : 'Documento privado · PDF exclusivo · envío inmediato'}</p>
            <div className={styles.memoriaInlineForm}>
              <BrochureForm agentEmail={property.agentEmail} compact={true} privacidadTexto={property.privacidadTexto} privacidadUrl={property.privacidadUrl} lang={lang} brochureUrl={property.brochure} />
            </div>
          </div>
          {property.brochurePages && property.brochurePages.length > 0 && (
            <div className={styles.memoriaBalancedRight}>
              <img loading="lazy" src={property.brochurePages[0]} alt="Memoria de la Residencia" className={styles.memoriaBalancedImg} onError={(e)=>(e.currentTarget.style.display='none')} />
            </div>
          )}
        </div>
      </RevealSection>

      {/* AGENTE EXPANDIDO — renderizado desde JSON */}
      {(agent.bio || agent.authority) && (
        <RevealSection className={styles.agentExpanded}>
          <div className={styles.agentExpandedInner}>
            <div className={styles.agentExpandedPhoto}>
              <img loading="lazy" src={agent.photo || 'https://larumstudio.com/wp-content/uploads/2026/07/William-Rowe-scaled.webp'} alt={agent.name || 'William Rowe'} />
            </div>
            <div className={styles.agentExpandedInfo}>
              <p className={styles.agentExpandedCargo}>{agent.cargo || agent.title}</p>
              <h2 className={styles.agentExpandedName}>{agent.name}</h2>
              {(agent.bio || agent.authority) && (
                <p className={styles.agentExpandedBio}>{agent.bio || agent.authority}</p>
              )}
              {agent.bioExtendida && (
                <p className={styles.agentExpandedBio}>{agent.bioExtendida}</p>
              )}
              {agent.idiomas && agent.idiomas.length > 0 && (
                <p className={styles.agentExpandedBio} style={{ marginTop: '1.25rem', color: '#fff' }}>
                  {lang === 'en' ? 'Languages' : 'Idiomas'}: {agent.idiomas.join(', ')}
                </p>
              )}
              {agent.credenciales && agent.credenciales.length > 0 && (
                <div className={styles.agentExpandedCredenciales}>
                  <p className={styles.agentCredencialesTitle}>{lang === 'en' ? 'Credentials' : 'Credenciales'}</p>
                  {agent.credenciales.map((cr: string, i: number) => (
                    <span key={i} className={styles.agentCredencial}>{cr}</span>
                  ))}
                </div>
              )}
              {agent.statsLogros && agent.statsLogros.length > 0 && (
                <div className={styles.agentStatsRow}>
                  {agent.statsLogros.map((s: any, i: number) => (
                    <div key={i} className={styles.agentStatItem}>
                      <div className={styles.agentStatVal}>{s.valor}</div>
                      <div className={styles.agentStatLabel}>{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
              <div className={styles.agentExpandedBtns}>
                <a href={whatsappUrl || '#'} target="_blank" rel="noopener" className={styles.agentExpandedBtn}><IconWhatsapp /> WHATSAPP</a>
                <a href={agent.email ? `mailto:${agent.email}` : '#'} className={styles.agentExpandedBtn}><IconMail /> EMAIL</a>
                <a href={agent.linkedin || 'https://www.linkedin.com/company/larumstudiohq/'} target="_blank" rel="noopener" className={styles.agentExpandedBtn}><IconLinkedin /> LINKEDIN</a>
                <a href={agent.instagram || 'https://www.instagram.com/larumstudio/'} target="_blank" rel="noopener" className={styles.agentExpandedBtn}><IconInstagram /> INSTAGRAM</a>
                {agent.scheduleUrl && (
                  <a href={agent.scheduleUrl} target="_blank" rel="noopener" className={styles.agentExpandedBtn}><IconCalendar /> {lang === 'en' ? 'BOOK' : 'AGENDAR'}</a>
                )}
              </div>
            </div>
          </div>
        </RevealSection>
      )}

      {/* FULL BLEED BREAK 2 */}
      <FullBleedBreak src="https://larumstudio.com/wp-content/uploads/2026/07/Salon-2560px-upscaled.webp" />

            {/* CONTACTO */}
      <RevealSection className={styles.contact} id="contacto">
        <div className={styles.contactClean}>
          <div className={styles.contactCleanLeft}>
            <p className={styles.contactEyebrow}>{lang === 'en' ? 'Private access' : 'Acceso privado'}</p>
            <h2 className={styles.contactTitle}>{lang === 'en' ? 'By appointment only.' : 'Visitas bajo cita.'}</h2>
            <div className={styles.contactEditorial}>
              {lang === 'en' ? (
                <>
                  <p>This residence is not shown on open portals. Viewings are arranged privately and by prior appointment.</p>
                  <p>Full details are shared only with previously qualified buyers. If this property feels like part of the story you are writing, leave us your details.</p>
                </>
              ) : (
                <>
                  <p>Esta residencia no se exhibe en portales. Las visitas se coordinan de forma privada y bajo cita previa.</p>
                  <p>Solo compartimos detalles con perfiles previamente cualificados. Si siente que esta propiedad merece ser parte de su historia, déjenos sus datos.</p>
                </>
              )}
            </div>
          </div>
          <div className={styles.contactQrCenter}>
            <img
              src="https://larumstudio.com/wp-content/uploads/2026/07/qr-code.png"
              alt={lang === 'en' ? 'QR code to open this property micro-site' : 'Código QR para abrir el micrositio de la propiedad'}
              style={{ width: '280px', height: '280px', maxWidth: '100%', objectFit: 'contain', display: 'block', margin: '0 auto' }}
            />
            <span className={styles.contactQrLabel} style={{ marginTop: '1.5rem', display: 'block' }}>{lang === 'en' ? 'Scan to access' : 'Escanee para acceder'}</span>
          </div>
          <form
            className={styles.contactForm}
            onSubmit={async (e) => {
              e.preventDefault()
              if (formStatus === 'loading' || formStatus === 'success') return
              setFormStatus('loading')
              try {
                const fd = new FormData()
                fd.append('nombre', form.nombre || '—')
                fd.append('email', form.email || '—')
                fd.append('telefono', form.telefono || '—')
                fd.append('fecha_preferida', form.fecha || '—')
                fd.append('_subject', lang === 'en' ? 'Private viewing request' : 'Solicitud de visita privada')
                fd.append('_captcha', 'false')
                fd.append('_template', 'table')
                await fetch(`https://formsubmit.co/${property.agentEmail}`, { method: 'POST', body: fd })
                setFormStatus('success')
              } catch (_) {
                setFormStatus('error')
              }
            }}
          >
            {formStatus === 'success' ? (
              <div className={styles.memoriaSuccess} role="status" aria-live="polite">
                <p className={styles.memoriaSuccessTitle}>{lang === 'en' ? 'We have received your request.' : 'Hemos recibido su solicitud.'}</p>
                <p className={styles.memoriaSuccessDesc}>{lang === 'en' ? 'We will be in touch shortly to arrange your visit.' : 'En breve nos pondremos en contacto con usted para coordinar la visita.'}</p>
              </div>
            ) : (
              <>
                {[
                  { name: 'nombre', placeholder: lang === 'en' ? 'NAME' : 'NOMBRE', type: 'text' },
                  { name: 'email', placeholder: 'EMAIL', type: 'email' },
                  { name: 'telefono', placeholder: lang === 'en' ? 'PHONE' : 'TELÉFONO', type: 'tel' },
                ].map(field => (
                  <div key={field.name} className={styles.formField}>
                    <input type={field.type} name={field.name} placeholder={field.placeholder}
                      value={form[field.name as keyof typeof form]}
                      onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                      className={styles.formInput}
                      disabled={formStatus === 'loading'} />
                  </div>
                ))}
                {/* Fecha preferida — clic abre Calendly en pestaña nueva si hay bookingUrl */}
                <div className={styles.formField}>
                  <input
                    type="text"
                    name="fecha"
                    placeholder={lang === 'en' ? 'PREFERRED DATE' : 'FECHA PREFERIDA'}
                    value={form.fecha}
                    onChange={e => setForm({ ...form, fecha: e.target.value })}
                    onFocus={() => {
                      if (property.bookingUrl && typeof window !== 'undefined') {
                        window.open(property.bookingUrl, '_blank', 'noopener,noreferrer')
                      }
                    }}
                    onClick={() => {
                      if (property.bookingUrl && typeof window !== 'undefined') {
                        window.open(property.bookingUrl, '_blank', 'noopener,noreferrer')
                      }
                    }}
                    className={styles.formInput}
                    disabled={formStatus === 'loading'}
                    readOnly={!!property.bookingUrl}
                    aria-label={lang === 'en' ? 'Preferred date — opens calendar in new tab' : 'Fecha preferida — abre el calendario en pestaña nueva'}
                    style={{ cursor: property.bookingUrl ? 'pointer' : 'text' }}
                  />
                </div>
                {property.privacidadTexto && (
                  <div className={styles.privacidadWrap}>
                    <input type="checkbox" className={styles.privacidadCheck} id="privacidad-contacto" required />
                    <label htmlFor="privacidad-contacto" className={styles.privacidadLabel}>
                      {(() => {
                        const raw = property.privacidadTexto.trim()
                        const linkRegex = /(política de privacidad|Privacy Policy)/i
                        const m = raw.match(linkRegex)
                        if (!property.privacidadUrl || !m) return raw
                        const [before, after] = raw.split(m[0])
                        return (
                          <>
                            {before}
                            <a href={property.privacidadUrl} target="_blank" rel="noopener">{m[0]}</a>
                            {after}
                          </>
                        )
                      })()}
                    </label>
                  </div>
                )}
                {formStatus === 'error' && (
                  <p role="alert" aria-live="polite" style={{ color: '#b34a4a', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                    {lang === 'en' ? 'Something went wrong. Please try again.' : 'No se pudo enviar. Por favor, inténtelo de nuevo.'}
                  </p>
                )}
                <button
                  type="submit"
                  className={styles.formBtn}
                  disabled={formStatus === 'loading'}
                  style={{ opacity: formStatus === 'loading' ? 0.6 : 1 }}
                >
                  {formStatus === 'loading'
                    ? (lang === 'en' ? 'Sending…' : 'Enviando…')
                    : (lang === 'en' ? 'Request a private viewing' : 'Solicitar agenda privada')}
                </button>
              </>
            )}
          </form>
        </div>
      </RevealSection>
      {/* FOOTER - Cambio 7: QR del footer actualizado */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerCol}>
            <div className={styles.footerLogo}>{property.footerTitulo || 'LARUM STUDIO'}</div>
            <p className={styles.footerTagline}>{property.footerDesc || 'Micrositios inmobiliarios de alto impacto para propiedades exclusivas.'}</p>
          </div>
          <nav className={styles.footerNavGrid}>
            {navLinks.map(l => <a key={l.href} href={l.href} className={styles.footerLink}>{l.label}</a>)}
          </nav>
          <div className={styles.footerVisita}>
            <p className={styles.footerVisitaTitle}>{lang === 'en' ? 'Viewings' : 'La visita'}</p>
            <ul className={styles.footerVisitaList}>
              {lang === 'en' ? (
                <>
                  <li>Viewings are arranged privately.</li>
                  <li>Property not available on open access.</li>
                  <li>Each visit is by prior appointment, in reserved time.</li>
                  <li>Personal accompaniment throughout the process.</li>
                </>
              ) : (
                <>
                  <li>Las visitas se coordinan de forma privada.</li>
                  <li>Propiedad no disponible en acceso abierto.</li>
                  <li>Cada visita requiere cita previa en horario reservado.</li>
                  <li>Acompañamiento personalizado durante todo el proceso.</li>
                </>
              )}
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} {property.footerTitulo || 'Larum Studio'}. {lang === 'en' ? 'All rights reserved.' : 'Todos los derechos reservados.'}</span>
          <span style={{ opacity: 0.5, fontSize: '0.7rem', letterSpacing: '0.15em' }}>{lang === 'en' ? 'Presentation by' : 'Presentación creada por'} <strong style={{ fontWeight: 400, color: '#c9a96e' }}>Larum Studio</strong></span>
        </div>
      </footer>

      {/* WhatsApp flotante eliminado — decisión de posicionamiento premium */}

      <AnalyticsScripts ga4Id={property.ga4Id} metaPixelId={property.metaPixelId} />
    </div>
  )
}