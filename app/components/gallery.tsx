'use client'

import { useState, useRef } from 'react'
import styles from './gallery.module.css'

interface GalleryImage {
  url: string
  caption: string
}

interface GalleryProps {
  images: GalleryImage[]
  heroVideo?: string
}

export default function Gallery({ images, heroVideo }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Touch swipe state
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const open = (i: number) => setLightboxIndex(i)
  const close = () => setLightboxIndex(null)
  const prev = () => setLightboxIndex(i => i !== null ? (i - 1 + images.length) % images.length : 0)
  const next = () => setLightboxIndex(i => i !== null ? (i + 1) % images.length : 0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY.current)
    // Solo swipe horizontal (más de 50px en X, menos de 80px en Y para no interferir con scroll)
    if (Math.abs(deltaX) > 50 && deltaY < 80) {
      if (deltaX < 0) next()
      else prev()
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  const heroImage = images[0]
  const thumbImages = images.slice(1, 5)
  const gridImages = images.slice(5, 30)

  return (
    <section className={styles.gallerySection} id="galeria">
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <span className={styles.eyebrow}>Galería</span>
          <h2 className={styles.title}>30 momentos para enamorarte</h2>
          <p className={styles.subtitle}>Una secuencia visual que sigue el recorrido natural de la propiedad: impacto, atmósfera y detalles.</p>
        </div>

        {/* Hero image or video */}
        <div className={styles.heroWrap} onClick={() => !heroVideo && open(0)}>
          {heroVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className={styles.heroImg}
              poster={heroImage?.url}
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
          ) : (
            <img src={heroImage?.url} alt={heroImage?.caption} className={styles.heroImg} loading="lazy" />
          )}
          <div className={styles.heroOverlay}>
            <span className={styles.heroCounter}>01 / {images.length}</span>
            <span className={styles.heroCaption}>{heroVideo ? 'Vista aérea' : heroImage?.caption}</span>
          </div>
          {!heroVideo && (
            <div className={styles.expandBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="15,3 21,3 21,9"/><polyline points="9,21 3,21 3,15"/>
                <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
              </svg>
            </div>
          )}
        </div>

        {/* 4 thumbnails */}
        <div className={styles.thumbRow}>
          {thumbImages.map((img, i) => (
            <div key={i} className={styles.thumb} onClick={() => open(i + 1)}>
              <img src={img.url} alt={img.caption} loading="lazy" />
              <div className={styles.thumbOverlay}>
                <span>{String(i + 2).padStart(2, '0')}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 5x5 grid */}
        <div className={styles.grid5}>
          {gridImages.map((img, i) => (
            <div key={i} className={styles.gridItem} onClick={() => open(i + 5)}>
              <img src={img.url} alt={img.caption} loading="lazy" />
              <div className={styles.gridOverlay}>
                <span className={styles.gridNum}>{String(i + 6).padStart(2, '0')}</span>
                <span className={styles.gridCaption}>{img.caption}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className={styles.lightbox}
          onClick={close}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button className={styles.lbClose} onClick={close} aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <button className={`${styles.lbNav} ${styles.lbPrev}`} onClick={e => { e.stopPropagation(); prev() }} aria-label="Anterior">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="15,18 9,12 15,6"/>
            </svg>
          </button>

          <div className={styles.lbContent} onClick={e => e.stopPropagation()}>
            <img src={images[lightboxIndex].url} alt={images[lightboxIndex].caption} />
            <div className={styles.lbMeta}>
              <span className={styles.lbCounter}>{String(lightboxIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
              <span className={styles.lbCaption}>{images[lightboxIndex].caption}</span>
            </div>
          </div>

          <button className={`${styles.lbNav} ${styles.lbNext}`} onClick={e => { e.stopPropagation(); next() }} aria-label="Siguiente">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="9,18 15,12 9,6"/>
            </svg>
          </button>
        </div>
      )}
    </section>
  )
}
