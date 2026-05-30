'use client'
import React from 'react'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Gallery from './components/gallery'
import propertyData from './data/property.json'
import styles from './page.module.css'

const { agent, property } = propertyData

const IconArea = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
    <rect x="2" y="2" width="9" height="9" /><rect x="13" y="2" width="9" height="9" />
    <rect x="2" y="13" width="9" height="9" /><rect x="13" y="13" width="9" height="9" />
  </svg>
)
const IconBuilding = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
    <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4" />
  </svg>
)
const IconBed = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
    <path d="M3 7v10M3 12h18M21 7v10M6 12V9a2 2 0 012-2h8a2 2 0 012 2v3" />
  </svg>
)
const IconBath = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
    <path d="M4 12h16a1 1 0 011 1v1a4 4 0 01-4 4H7a4 4 0 01-4-4v-1a1 1 0 011-1zM7 12V6a3 3 0 016 0" />
    <path d="M9 19l-1 3M15 19l1 3" />
  </svg>
)
const IconPlay = () => (
  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
)
const IconArrow = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="13,6 19,12 13,18" />
  </svg>
)
const IconPhone = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 012 1.18 2 2 0 014 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
)
const IconMail = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)
const IconInstagram = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)
const IconWhatsapp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)
const IconMenu = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
    <line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" />
  </svg>
)
const IconClose = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
const IconCheck = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <polyline points="20,6 9,17 4,12" />
  </svg>
)
const IconDownload = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const navLinks = [
  { href: '#residencia', label: 'Residencia' },
  { href: '#galeria', label: 'Galería' },
  { href: '#amenities', label: 'Amenities' },
  { href: '#ubicacion', label: 'Ubicación' },
  { href: '#contacto', label: 'Contacto' },
]

const heroStats = [
  { icon: <IconArea />, value: '3.900 m²', label: 'TERRENO' },
  { icon: <IconBuilding />, value: '800 m²', label: 'CONSTRUIDOS' },
  { icon: <IconBed />, value: '6', label: 'DORMITORIOS' },
  { icon: <IconBath />, value: '5', label: 'BAÑOS' },
]

// FIX: 6 tarjetas para que en móvil queden 2 columnas × 3 filas
const features = [
  {
    icon: <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/><path d="M3.5 8.5l2 2M18.5 8.5l-2 2M12 3v2M12 19v2"/></svg>,
    title: 'ARQUITECTURA', desc: 'Atención al detalle en cada línea y material.',
  },
  {
    icon: <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><rect x="2" y="2" width="9" height="9" rx="1"/><rect x="13" y="2" width="9" height="9" rx="1"/><rect x="2" y="13" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"/></svg>,
    title: 'PRIVACIDAD', desc: 'Ubicación estratégica y acceso controlado.',
  },
  {
    icon: <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M3 12h18M12 3v18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/></svg>,
    title: 'AMPLITUD', desc: 'Ambientes generosos que fluyen con naturalidad.',
  },
  {
    icon: <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
    title: 'LUZ NATURAL', desc: 'Grandes ventanales que conectan con el exterior.',
  },
  {
    icon: <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M9 22V12h6v10"/></svg>,
    title: 'ACABADOS PREMIUM', desc: 'Materiales nobles seleccionados con criterio y propósito.',
  },
  {
    icon: <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    title: 'EXCLUSIVIDAD', desc: 'Una propiedad única en su entorno. Sin comparación posible.',
  },
]

const amenitiesList = [
  { icon: <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M3 16h18M3 16a9 9 0 0118 0M6 16V10a6 6 0 0112 0v6"/><path d="M2 20h20M12 4v2"/></svg>, label: 'PISCINA INFINITA' },
  { icon: <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M3 22V8a1 1 0 011-1h4V5a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v14"/><path d="M10 22v-5h4v5M7 10h2v3H7zM15 10h2v3h-2z"/></svg>, label: 'ÁREA GOURMET' },
  { icon: <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M6 18V9M18 18V9M3 9h18M7 9V5a2 2 0 012-2h6a2 2 0 012 2v4"/><path d="M10 13h4M10 16h4M3 18h18v2H3z"/></svg>, label: 'GIMNASIO PRIVADO' },
  { icon: <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 20h8M12 18v2"/><circle cx="12" cy="11" r="3"/></svg>, label: 'HOME THEATER' },
  { icon: <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M12 2a5 5 0 000 10 5 5 0 000-10z"/><path d="M12 12v10M7 17c1.5-1 3.5-1 5 0s3.5 1 5 0"/><path d="M4 21c1.5-1 3.5-1 5 0s3.5 1 5 0s3.5 1 5 0"/></svg>, label: 'JARDÍN INTERNO' },
]

const landmarks = [
  { label: 'Lago\nYpacaraí', top: '15%', left: '20%', isMain: false },
  { label: 'Centro\nComercial', top: '30%', left: '65%', isMain: false },
  { label: 'Clínica\nCercana', top: '55%', left: '38%', isMain: false },
  { label: 'Colegio\nInternacional', top: '25%', left: '82%', isMain: false },
  { label: 'Ubicación\nde la Villa', top: '62%', left: '60%', isMain: true },
]

function PageContent() {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode')
  const isTeaser = mode === 'teaser'
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', fecha: '' })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (isTeaser) return <TeaserPage />

  const whatsappUrl = `https://wa.me/${agent.whatsapp}?text=Hola, me interesa la Villa en ${property.location.address}. ¿Podemos hablar?`

  return (
    <div className={styles.page}>

      {/* ── NAVBAR ── */}
      <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
        <div className={styles.navInner}>
          <a href="#residencia" className={styles.navLogo}>LARUM<span>STUDIO</span></a>
          <div className={styles.navLinks}>
            {navLinks.map(l => <a key={l.href} href={l.href} className={styles.navLink}>{l.label}</a>)}
          </div>
          <div className={styles.navRight}>
            <a href={whatsappUrl} className={styles.navCta} target="_blank" rel="noopener">Agendar Visita</a>
            <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map(l => <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>)}
        </div>
      )}

      {/* ── HERO ── */}
      <section id="residencia" className={styles.hero}>
        <video className={styles.heroBgVideo} autoPlay muted loop playsInline
          poster="https://larumstudio.com/wp-content/uploads/2026/05/atardecer.webp">
          <source src="https://larumstudio.com/wp-content/uploads/2026/05/Transicion-dia-a-noche-cinematica-Optimizada-Web.mp4" type="video/mp4" />
        </video>
        <div className={styles.heroGradientLR} />
        <div className={styles.heroGradientTB} />
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <p className={styles.heroEyebrow}>San Bernardino, Paraguay</p>
            <h1 className={styles.heroTitle}>Una villa de ensueño<br />que redefine el lujo.</h1>
            <p className={styles.heroDesc}>Diseñada para quienes valoran la arquitectura, la privacidad y los detalles que elevan cada momento.</p>
            <a href="#video" className={styles.heroPlayBtn}>
              <span className={styles.heroPlayCircle}><IconPlay /></span>
              <span className={styles.heroPlayLabel}>Ver Presentación</span>
            </a>
          </div>
          <div className={styles.heroCard}>
            {heroStats.map((s, i) => (
              <div key={i} className={`${styles.heroStat} ${i < heroStats.length - 1 ? styles.heroStatBorder : ''}`}>
                <span className={styles.heroStatIcon}>{s.icon}</span>
                <div>
                  <div className={styles.heroStatValue}>{s.value}</div>
                  <div className={styles.heroStatLabel}>{s.label}</div>
                </div>
              </div>
            ))}
            <div className={styles.heroCardFooter}>
              <a href="#caracteristicas" className={styles.heroCardLink}>Ver Detalles <span>———</span></a>
            </div>
          </div>
        </div>
        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeLine} />
          <span className={styles.heroBadgeText}>Exclusiva en Venta</span>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className={styles.story} id="narrativa">
        <div className={styles.storyInner}>
          <div className={styles.storyLeft}>
            <p className={styles.eyebrow}>La Historia</p>
            <h2 className={styles.storyTitle}>Una residencia que<br />se siente antes de verse.</h2>
            <p className={styles.storyDesc}>Con 400 m² construidos sobre un lote de 800 m², esta villa en San Bernardino fue concebida para quienes buscan algo más que una casa: presencia, exclusividad y una experiencia de vida difícil de igualar.</p>
            <p className={styles.storyDesc} style={{ marginTop: '1.25rem' }}>Desde el exterior, la propiedad impresiona por su escala y su arquitectura limpia. La piscina exterior se convierte en el corazón visual y emocional de la casa.</p>
          </div>
          <div className={styles.storyRight} id="video">
            <video controls poster="https://larumstudio.com/wp-content/uploads/2026/05/atardecer.webp" className={styles.storyVideo} preload="none">
              <source src={property.videoUrl} type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className={styles.features}>
        <div className={styles.featuresInner}>
          <p className={styles.eyebrow}>Diseñada sin Compromisos</p>
          <div className={styles.featuresGrid}>
            {features.map((f, i) => (
              <div key={i} className={styles.featureItem}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY PREVIEW ── */}
      {/* FIX: layout simplificado. Solo galRow1: atardecer a la izquierda,
          amanecer y noche apiladas a la derecha. Sin galRow2 ni galRow3
          que causaban solapamiento y complejidad innecesaria. */}
      <section className={styles.gallerySection} id="galeria">
        <div className={styles.galleryInner}>
          <div className={styles.galleryHeader}>
            <div>
              <p className={styles.eyebrow}>Galería</p>
              <h2 className={styles.galleryTitle}>Recorre cada espacio.</h2>
            </div>
            <a href="#galeria-completa" className={styles.galleryMoreBtn}>Ver toda la galería <IconArrow /></a>
          </div>
          <div className={styles.galRow1}>
            <div className={styles.galBig}>
              <img src="https://larumstudio.com/wp-content/uploads/2026/05/atardecer.webp" alt="Villa al atardecer" />
              <div className={styles.galCaption}>Atardecer</div>
            </div>
            <div className={styles.galStack}>
              <div className={styles.galSmall}>
                <img src="https://larumstudio.com/wp-content/uploads/2026/05/amanecer.webp" alt="Al amanecer" />
                <div className={styles.galCaption}>Amanecer</div>
              </div>
              <div className={styles.galSmallNoche}>
                <img
                  src="https://larumstudio.com/wp-content/uploads/2026/04/unnamed-10.webp"
                  alt="Noche"
                  style={{ objectPosition: 'center 70%' }}
                />
                <div className={styles.galCaption}>Noche</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GALERÍA COMPLETA ── separación explícita con borde top */}
      <div id="galeria-completa" className={styles.galeriaCompletaWrap}>
        <Gallery images={property.gallery} heroVideo="https://larumstudio.com/wp-content/uploads/2026/05/dron-aereo-Optimizada-Web.mp4" />
      </div>

      {/* ── AMENITIES ── */}
      <section className={styles.amenities} id="amenities">
        <div className={styles.amenitiesLeft}>
          <p className={styles.eyebrow}>Amenities</p>
          <h2 className={styles.amenitiesTitle}>Bienestar en<br />cada detalle.</h2>
          <p className={styles.amenitiesDesc}>Espacios diseñados para disfrutar en familia, recibir con elegancia y relajarse en completo confort.</p>
          <div className={styles.amenitiesIcons}>
            {amenitiesList.map((a, i) => (
              <div key={i} className={styles.amenityItem}>
                <div className={styles.amenityIcon}>{a.icon}</div>
                <span className={styles.amenityLabel}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.amenitiesRight}>
          <img src="https://larumstudio.com/wp-content/uploads/2026/04/unnamed-22.webp" alt="Amenities de la villa" />
          <div className={styles.amenitiesImgOverlay} />
        </div>
      </section>

      {/* ── CARACTERÍSTICAS ── */}
      <section className={styles.caracteristicas} id="caracteristicas">
        <div className={styles.caracteristicasInner}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p className={styles.eyebrow}>Características</p>
            <h2 className={styles.sectionTitle}>Cada detalle pensado</h2>
          </div>
          <div className={styles.featuresGrid3}>
            {Object.entries(property.features).map(([cat, items]) => (
              <div key={cat} className={styles.featCol}>
                <h3 className={styles.featColTitle}>
                  {cat === 'espacios' ? 'Espacios' : cat === 'equipamiento' ? 'Equipamiento' : 'Extras'}
                </h3>
                <div className={styles.featColLine} />
                <ul className={styles.featList}>
                  {(items as string[]).map((item, i) => (
                    <li key={i} className={styles.featItem}>
                      <span className={styles.featCheck}><IconCheck /></span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UBICACIÓN ── */}
      <section className={styles.location} id="ubicacion">
        <div className={styles.locationInner}>
          <div className={styles.locationLeft}>
            <p className={styles.eyebrow}>Ubicación</p>
            <h2 className={styles.locationTitle}>San Bernardino,<br />el corazón del lago.</h2>
            <p className={styles.locationDesc}>A orillas del lago Ypacaraí, en la ciudad más exclusiva del Paraguay. Un entorno residencial con conectividad, naturaleza y privacidad en perfecta armonía.</p>
            <a href="https://www.google.com/maps/place/San+Bernardino/@-25.3277542,-57.2992066,13z" target="_blank" rel="noopener" className={styles.locationBtn}>Ver Ubicación en Mapa</a>
          </div>
          <div className={styles.locationMap}>
            <svg className={styles.mapGrid} preserveAspectRatio="none">
              <defs><pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="#ffffff" strokeWidth="0.4" /></pattern></defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            <svg className={styles.mapStreets} preserveAspectRatio="none">
              <line x1="0" y1="45%" x2="100%" y2="45%" stroke="#c9a96e" strokeWidth="1.5" opacity="0.2" />
              <line x1="0" y1="65%" x2="100%" y2="65%" stroke="#ffffff" strokeWidth="0.8" opacity="0.12" />
              <line x1="35%" y1="0" x2="35%" y2="100%" stroke="#c9a96e" strokeWidth="1.5" opacity="0.2" />
              <line x1="65%" y1="0" x2="65%" y2="100%" stroke="#ffffff" strokeWidth="0.8" opacity="0.12" />
            </svg>
            {landmarks.map((lm, i) => (
              <div key={i} className={styles.landmark} style={{ top: lm.top, left: lm.left }}>
                <div className={styles.landmarkDotWrap}>
                  {lm.isMain ? <div className={styles.landmarkMain}><div className={styles.landmarkPulse} /></div> : <div className={styles.landmarkDot} />}
                </div>
                <div className={`${styles.landmarkLabel} ${lm.isMain ? styles.landmarkLabelMain : ''}`}>{lm.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANO ── */}
      <section className={styles.plano} id="plano">
        <div className={styles.planoInner}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className={styles.eyebrow}>Distribución</p>
            <h2 className={styles.sectionTitle}>La distribución ideal</h2>
          </div>
          <div className={styles.planoLayout}>
            <div className={styles.planoImg}>
              <img src={property.floorPlan.image} alt="Plano 3D San Bernardino" />
            </div>
            <div className={styles.planoTable}>
              <table className={styles.areaTable}>
                <thead><tr><th>Ambiente</th><th>Superficie</th></tr></thead>
                <tbody>
                  {property.floorPlan.areas.map((a, i) => (
                    <tr key={i}><td>{a.ambiente}</td><td>{a.superficie}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── GARANTÍA ── */}
      <section className={styles.garantia}>
        <div className={styles.garantiaInner}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className={styles.eyebrow}>Garantía</p>
            <h2 className={styles.sectionTitle}>Una operación segura y transparente</h2>
          </div>
          <div className={styles.garantiaGrid}>
            {[...property.trust, 'Asesoramiento profesional incluido'].map((item, i) => (
              <div key={i} className={styles.garantiaItem}>
                <span className={styles.garantiaCheck}><IconCheck /></span>
                <span className={styles.garantiaText}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEMORIA DE LA RESIDENCIA ── */}
      <section className={styles.memoria}>
        <div className={styles.memoriaInner}>
          <div className={styles.memoriaLeft}>
            <p className={styles.eyebrow}>Documentación</p>
            <h2 className={styles.memoriaTitle}>Memoria de<br />la Residencia.</h2>
            <p className={styles.memoriaDesc}>Un documento de presentación diseñado para quienes desean conocer esta propiedad en profundidad. Arquitectura, espacios, acabados y experiencia reunidos en un solo lugar.</p>
            <a href="/brochure-san-bernardino.pdf" download className={styles.memoriaBtn}>
              <IconDownload />Descargar Memoria
            </a>
          </div>
          <div className={styles.memoriaRight}>
            <div className={styles.memoriaPreview}>
              <div className={styles.memoriaPages}>
                {/* Página trasera */}
                <div className={styles.memoriaPage} style={{ transform: 'rotate(-3deg) translateX(-8px)', zIndex: 1 }}>
                  <img src="https://larumstudio.com/wp-content/uploads/2026/04/unnamed-3.webp" alt="" />
                  <div className={styles.memoriaPageOverlay} />
                </div>
                {/* Página central */}
                <div className={styles.memoriaPage} style={{ transform: 'rotate(1.5deg)', zIndex: 2 }}>
                  <img src="https://larumstudio.com/wp-content/uploads/2026/04/unnamed-22.webp" alt="" />
                  <div className={styles.memoriaPageOverlay} />
                </div>
                {/* FIX portada: imagen de la portada real del brochure — casa de noche con piscina */}
                <div className={styles.memoriaPage} style={{ transform: 'rotate(-0.5deg) translateX(8px)', zIndex: 3 }}>
                  <img
                    src="https://larumstudio.com/wp-content/uploads/2026/05/noche.webp"
                    alt="Portada brochure"
                    style={{ objectPosition: 'center 60%' }}
                  />
                  <div className={styles.memoriaPageOverlay} />
                  <div className={styles.memoriaPageLabel}>
                    <span>LARUM</span>
                    <span>Residencia San Bernardino</span>
                  </div>
                </div>
              </div>
              <div className={styles.memoriaStats}>
                <div className={styles.memoriaStatItem}>
                  <span className={styles.memoriaStatNum}>16</span>
                  <span className={styles.memoriaStatLabel}>páginas</span>
                </div>
                <div className={styles.memoriaStatDivider} />
                <div className={styles.memoriaStatItem}>
                  <span className={styles.memoriaStatNum}>PDF</span>
                  <span className={styles.memoriaStatLabel}>descarga inmediata</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className={styles.contact} id="contacto">
        <div className={styles.contactInner}>
          <div className={styles.contactAgent}>
            <div className={styles.agentPhoto}>
              <img src={agent.photo} alt={agent.name} onError={e => (e.currentTarget.style.display = 'none')} />
            </div>
            <div className={styles.agentData}>
              <p className={styles.contactEyebrow}>Presentada por</p>
              <h3 className={styles.agentName}>{agent.name}</h3>
              <p className={styles.agentRole}>{agent.title}</p>
              <div className={styles.agentContacts}>
                <div className={styles.agentContact}><IconPhone />{agent.phone}</div>
                <div className={styles.agentContact}><IconMail />{agent.email}</div>
                <div className={styles.agentContact}><IconInstagram />@larum.studio</div>
              </div>
            </div>
          </div>
          <div className={styles.contactCta}>
            <h2 className={styles.contactTitle}>Agenda una visita privada<br />y descubre esta propiedad.</h2>
            <p className={styles.contactDesc}>Experiencias exclusivas para compradores que buscan excelencia.</p>
            <a href={whatsappUrl} className={styles.contactWa} target="_blank" rel="noopener">
              <IconWhatsapp /> Contactar por WhatsApp
            </a>
          </div>
          <div className={styles.contactForm}>
            {[
              { name: 'nombre', placeholder: 'NOMBRE', type: 'text' },
              { name: 'email', placeholder: 'EMAIL', type: 'email' },
              { name: 'telefono', placeholder: 'TELÉFONO', type: 'tel' },
              { name: 'fecha', placeholder: 'FECHA PREFERIDA', type: 'text' },
            ].map(field => (
              <div key={field.name} className={styles.formField}>
                <input type={field.type} name={field.name} placeholder={field.placeholder}
                  value={form[field.name as keyof typeof form]}
                  onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                  className={styles.formInput} />
              </div>
            ))}
            <button className={styles.formBtn}>Agendar Visita Privada</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLogo}>LARUM<span>STUDIO</span></div>
          <nav className={styles.footerNav}>
            {navLinks.map(l => <a key={l.href} href={l.href} className={styles.footerLink}>{l.label}</a>)}
          </nav>
          <div className={styles.footerSocials}>
            <a href={agent.instagram} target="_blank" rel="noopener"><IconInstagram /></a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2026 Larum Studio. Todos los derechos reservados.</span>
        </div>
      </footer>

      <a href={whatsappUrl} className={styles.waFloat} target="_blank" rel="noopener" aria-label="WhatsApp">
        <IconWhatsapp />
      </a>
    </div>
  )
}

function TeaserPage() {
  const whatsappUrl = `https://wa.me/${agent.whatsapp}?text=Quiero un micrositio para mi propiedad`
  const [reveal, setReveal] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setReveal(p => Math.min(p + 1, 3)), 900)
    return () => clearInterval(t)
  }, [])
  const pains = [
    { problem: 'Tu propiedad lleva semanas publicada y solo recibís consultas sin compromiso.', solution: 'Un micrositio premium filtra compradores serios desde el primer clic.' },
    { problem: 'Las fotos en portales se ven iguales que todas las demás.', solution: 'Narrativa editorial + galería cinematográfica = propiedad que se recuerda.' },
    { problem: 'No podés mostrar el contexto, el barrio ni el valor real de la inversión.', solution: 'Mapa, comparativa de mercado y diferenciales únicos en un solo lugar.' },
  ]
  return (
    <div className={styles.teaserPage}>
      <div className={styles.teaserBg} />
      <div className={styles.teaserContent}>
        <p className={styles.eyebrow}>Larum Studio · Auditoría de Percepción</p>
        <h1 className={styles.teaserTitle}>¿Tu propiedad se vende o se ignora?</h1>
        <div className={styles.goldDivider} />
        <p className={styles.teaserSubtitle}>La diferencia entre vender en semanas o meses no es el precio. Es cómo se presenta.</p>
        <div className={styles.teaserPains}>
          {pains.slice(0, reveal + 1).map((p, i) => (
            <div key={i} className={`${styles.painCard} ${i <= reveal ? styles.painVisible : ''}`}>
              <p className={styles.painProblem}>{p.problem}</p>
              <p className={styles.painSolution}>{p.solution}</p>
            </div>
          ))}
        </div>
        {reveal >= 2 && (
          <div className={styles.teaserCta}>
            <a href="/" className={styles.ctaBtnPrimary}>Ver micrositio completo <IconArrow /></a>
            <a href={whatsappUrl} className={styles.ctaBtnGhost} target="_blank" rel="noopener">
              <IconWhatsapp /> Quiero un micrositio así
            </a>
          </div>
        )}
      </div>
      <a href={whatsappUrl} className={styles.waFloat} target="_blank" rel="noopener"><IconWhatsapp /></a>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div style={{ background: '#0a0a0a', minHeight: '100vh' }} />}>
      <PageContent />
    </Suspense>
  )
}
