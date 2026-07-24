'use client'
/* ============================================================
   app/components/AdaptiveNav.tsx  —  ARCHIVO NUEVO

   NAV EDITORIAL ADAPTATIVO

   El problema que resuelve:
   page.module.css fuerza fondo negro sólido dos veces —línea
   22 y línea 4345, esta última con !important—, lo que anula
   el efecto transparente→sólido programado en
   improvements.module.css. Hoy ese efecto no funciona.

   Un nav negro fijo se sostiene sobre secciones oscuras y
   corta la página en dos sobre las claras. Si quieres cambios
   de color por sección —y los quieres—, el nav tiene que leer
   lo que hay debajo.

   Cómo lo hace:
   Mide la luminancia real del fondo de la sección que está
   bajo la barra, en tiempo de ejecución. No hay lista de
   secciones que mantener: si mañana añades una sección clara,
   funciona sin tocar nada.

   Resultado: tipografía flotando sobre la página, oscura
   sobre fondo claro y clara sobre fondo oscuro, con blur
   suave en ambos casos. Es lo que hace Aesop, Cereal,
   Kinfolk. No es una barra: es un elemento editorial.
   ============================================================ */

import { useEffect, useState, useRef } from 'react'

export type NavTone = 'light' | 'dark'

/** Luminancia relativa (WCAG). >0.5 = fondo claro. */
function luminance(rgb: string): number {
  const m = rgb.match(/\d+/g)
  if (!m || m.length < 3) return 0
  const [r, g, b] = m.slice(0, 3).map(n => {
    const c = parseInt(n, 10) / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Sube por el árbol hasta encontrar un fondo con opacidad
 * real. Un elemento con background transparent hereda
 * visualmente el de su padre.
 */
function resolveBackground(el: Element | null): string {
  let node: Element | null = el
  let depth = 0
  while (node && depth < 8) {
    const bg = window.getComputedStyle(node).backgroundColor
    const alpha = bg.match(/[\d.]+\)$/)
    const isTransparent =
      bg === 'transparent' ||
      bg === 'rgba(0, 0, 0, 0)' ||
      (bg.startsWith('rgba') && alpha && parseFloat(alpha[0]) < 0.5)
    if (!isTransparent) return bg
    node = node.parentElement
    depth++
  }
  return 'rgb(17, 17, 17)'
}

/**
 * Devuelve el tono que debe adoptar el nav según lo que hay
 * justo debajo de él.
 *
 * @param offset  altura del nav en px; se mide un poco por
 *                debajo de su base para no leerse a sí mismo
 */
export function useAdaptiveNavTone(offset = 88): NavTone {
  const [tone, setTone] = useState<NavTone>('dark')
  const lastRef = useRef<NavTone>('dark')

  useEffect(() => {
    let raf = 0

    const measure = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        /* Punto de muestreo: centro horizontal, justo bajo el nav */
        const x = window.innerWidth / 2
        const y = offset + 8

        /* Ocultamos el nav un instante para no medirlo a él */
        const nav = document.querySelector<HTMLElement>('[data-adaptive-nav]')
        const prev = nav?.style.pointerEvents
        if (nav) nav.style.pointerEvents = 'none'

        const el = document.elementFromPoint(x, y)
        if (nav) nav.style.pointerEvents = prev || ''

        if (!el) return

        const bg = resolveBackground(el)
        const next: NavTone = luminance(bg) > 0.5 ? 'light' : 'dark'

        /* Solo re-renderizamos cuando cambia de verdad */
        if (next !== lastRef.current) {
          lastRef.current = next
          setTone(next)
        }
      })
    }

    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    /* Primera medición tras el pintado inicial */
    const t = setTimeout(measure, 120)

    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      cancelAnimationFrame(raf)
      clearTimeout(t)
    }
  }, [offset])

  return tone
}

/**
 * Indica si la página ya se ha desplazado lo suficiente para
 * que el nav adopte fondo. Separado del tono a propósito:
 * son dos ejes distintos.
 */
export function useScrolledPast(threshold = 60): boolean {
  const [past, setPast] = useState(false)
  useEffect(() => {
    const on = () => setPast(window.scrollY > threshold)
    window.addEventListener('scroll', on, { passive: true })
    on()
    return () => window.removeEventListener('scroll', on)
  }, [threshold])
  return past
}
