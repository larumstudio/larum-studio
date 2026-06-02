'use client'
import React, { useState, useEffect } from 'react'
import Gallery from './gallery'
import styles from '../page.module.css'

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

const navLinks = [
  { href: '#residencia', label: 'Residencia' },
  { href: '#galeria', label: 'Galería' },
  { href: '#amenities', label: 'Amenities' },
  { href: '#ubicacion', label: 'Ubicación' },
  { href: '#contacto', label: 'Contacto' },
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

const featureIcons: React.ReactNode[] = [
  <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>,
  <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><rect x="2" y="2" width="9" height="9" rx="1"/><rect x="13" y="2" width="9" height="9" rx="1"/><rect x="2" y="13" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"/></svg>,
  <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M3 12h18M12 3v18"/></svg>,
  <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M9 22V12h6v10"/></svg>,
  <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
]

const defaultIcon = <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><circle cx="12" cy="12" r="9"/></svg>

export default function PropertyPage({ data }: { data: any }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', fecha: '' })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { property, agent } = data
  const whatsappUrl = `https://wa.me/${agent.whatsapp}?text=Hola, me interesa ${property.name}. ¿Podemos hablar?`

  return (
    <div className={styles.page}>

      {/* NAVBAR */}
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

      {/* HERO */}
      <section id="residencia" className={styles.hero}>
        {property.videoHero ? (
          <video className={styles.heroBgVideo} autoPlay muted loop playsInline poster={property.posterHero}>
            <source src={property.videoHero} type="video/mp4" />
          </video>
        ) : (
          <img src={property.posterHero} alt={property.name} className={styles.heroBgVideo} />
        )}
        <div className={styles.heroGradientLR} />
        <div className={styles.heroGradientTB} />
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <p className={styles.heroEyebrow}>{property.location.city}, {property.location.country}</p>
            <h1 className={styles.heroTitle}>{property.name}</h1>
            <p className={styles.heroDesc}>{property.tagline}</p>
            <a href="#video" className={styles.heroPlayBtn}>
              <span className={styles.heroPlayCircle}><IconPlay /></span>
              <span className={styles.heroPlayLabel}>Ver Presentación</span>
            </a>
          </div>
          <div className={styles.heroCard}>
            {[
              { value: property.precio, label: 'PRECIO' },
              { value: property.stats.terreno, label: 'TERRENO' },
              { value: property.stats.construidos, label: 'CONSTRUIDOS' },
              { value: property.stats.dormitorios, label: 'DORMITORIOS' },
              { value: property.stats.banos, label: 'BAÑOS' },
            ].map((s, i, arr) => (
              <div key={i} className={`${styles.heroStat} ${i < arr.length - 1 ? styles.heroStatBorder : ''}`}>
                <div>
                  <div className={styles.heroStatValue}>{s.value}</div>
                  <div className={styles.heroStatLabel}>{s.label}</div>
                </div>
              </div>
            ))}
            <div className={styles.heroCardFooter}>
              <a href="#caracteristicas" className={styles.heroCardLink}>Ver Detalles <IconArrow /></a>
            </div>
          </div>
        </div>
        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeLine} />
          <span className={styles.heroBadgeText}>Exclusiva en Venta</span>
        </div>
      </section>

      {/* STORY */}
      <section className={styles.story} id="narrativa">
        <div className={styles.storyInner}>
          <div className={styles.storyLeft}>
            <p className={styles.eyebrow}>La Historia</p>
            <h2 className={styles.storyTitle}>{property.story?.title || property.name}</h2>
            {property.story?.paragraphs ? (
              property.story.paragraphs.map((p: string, i: number) => (
                <p key={i} className={styles.storyDesc} style={i > 0 ? { marginTop: '1.25rem' } : {}}>{p}</p>
              ))
            ) : (
              <p className={styles.storyDesc}>{property.tagline}</p>
            )}
          </div>
          <div className={styles.storyRight} id="video">
            {property.videoPresentacion ? (
              <video controls poster={property.posterHero} className={styles.storyVideo} preload="none">
                <source src={property.videoPresentacion} type="video/mp4" />
              </video>
            ) : (
              <img src={property.posterHero} alt={property.name} className={styles.storyVideo} />
            )}
          </div>
        </div>
      </section>

      {/* FEATURES — Diseñada sin Compromisos */}
      {property.featuresGrid && (
        <section className={styles.features}>
          <div className={styles.featuresInner}>
            <p className={styles.eyebrow}>{property.featuresGrid.eyebrow || 'Diseñada sin Compromisos'}</p>
            <div className={styles.featuresGrid}>
              {property.featuresGrid.items.map((f: any, i: number) => (
                <div key={i} className={styles.featureItem}>
                  <div className={styles.featureIcon}>{featureIcons[i] || featureIcons[0]}</div>
                  <h3 className={styles.featureTitle}>{f.title}</h3>
                  <p className={styles.featureDesc}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GALLERY PREVIEW */}
      <section className={styles.gallerySection} id="galeria">
        <div className={styles.galleryInner}>
          <div className={styles.galleryHeader}>
            <div>
              <p className={styles.eyebrow}>Galería</p>
              <h2 className={styles.galleryTitle}>Recorre cada espacio.</h2>
            </div>
            <a href="#galeria-completa" className={styles.galleryMoreBtn}>Ver toda la galería <IconArrow /></a>
          </div>
          {property.galleryPreview && (
            <div className={styles.galRow1}>
              <div className={styles.galBig}>
                <img src={property.galleryPreview.main.url} alt={property.galleryPreview.main.caption} />
                <div className={styles.galCaption}>{property.galleryPreview.main.caption}</div>
              </div>
              <div className={styles.galStack}>
                {property.galleryPreview.secondary.map((img: any, i: number) => (
                  <div key={i} className={styles.galSmall}>
                    <img src={img.url} alt={img.caption} style={{ objectPosition: img.objectPosition || 'center center' }} />
                    <div className={styles.galCaption}>{img.caption}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* GALERÍA COMPLETA */}
      {property.gallery && property.gallery.length > 0 && (
        <div id="galeria-completa" className={styles.galeriaCompletaWrap}>
          <Gallery images={property.gallery} heroVideo={property.videoPresentacion} />
        </div>
      )}

      {/* AMENITIES */}
      {property.amenities && (
        <section className={styles.amenities} id="amenities">
          <div className={styles.amenitiesLeft}>
            <p className={styles.eyebrow}>Amenities</p>
            <h2 className={styles.amenitiesTitle}>Bienestar en<br />cada detalle.</h2>
            <p className={styles.amenitiesDesc}>Espacios diseñados para disfrutar en familia, recibir con elegancia y relajarse en completo confort.</p>
            <div className={styles.amenitiesIcons}>
              {property.amenities.map((label: string, i: number) => (
                <div key={i} className={styles.amenityItem}>
                  <div className={styles.amenityIcon}>{amenityIcons[label] || defaultIcon}</div>
                  <span className={styles.amenityLabel}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.amenitiesRight}>
            <img src={property.amenitiesImage || property.galleryPreview?.secondary[0]?.url || property.posterHero} alt="Amenities" />
            <div className={styles.amenitiesImgOverlay} />
          </div>
        </section>
      )}

      {/* CARACTERÍSTICAS */}
      {property.features && (
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
      )}

      {/* UBICACIÓN */}
      <section className={styles.location} id="ubicacion">
        <div className={styles.locationInner}>
          <div className={styles.locationLeft}>
            <p className={styles.eyebrow}>Ubicación</p>
            <h2 className={styles.locationTitle}>{property.location.city}</h2>
            <p className={styles.locationDesc}>{property.location.description || property.location.address}</p>
            {property.location.mapsUrl && (
              <a href={property.location.mapsUrl} target="_blank" rel="noopener" className={styles.locationBtn}>
                Ver Ubicación en Mapa
              </a>
            )}
          </div>
          <div className={styles.locationMap}>
            <svg className={styles.mapGrid} preserveAspectRatio="none">
              <defs><pattern id="gridP" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="#ffffff" strokeWidth="0.4" /></pattern></defs>
              <rect width="100%" height="100%" fill="url(#gridP)" />
            </svg>
            <svg className={styles.mapStreets} preserveAspectRatio="none">
              <line x1="0" y1="45%" x2="100%" y2="45%" stroke="#c9a96e" strokeWidth="1.5" opacity="0.2" />
              <line x1="0" y1="65%" x2="100%" y2="65%" stroke="#ffffff" strokeWidth="0.8" opacity="0.12" />
              <line x1="35%" y1="0" x2="35%" y2="100%" stroke="#c9a96e" strokeWidth="1.5" opacity="0.2" />
              <line x1="65%" y1="0" x2="65%" y2="100%" stroke="#ffffff" strokeWidth="0.8" opacity="0.12" />
            </svg>
            {property.location.landmarks && property.location.landmarks.map((lm: any, i: number) => (
              <div key={i} className={styles.landmark} style={{ top: lm.top, left: lm.left }}>
                <div className={styles.landmarkDotWrap}>
                  {lm.isMain
                    ? <div className={styles.landmarkMain}><div className={styles.landmarkPulse} /></div>
                    : <div className={styles.landmarkDot} />
                  }
                </div>
                <div className={`${styles.landmarkLabel} ${lm.isMain ? styles.landmarkLabelMain : ''}`}>{lm.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANO */}
      {property.floorPlan && property.floorPlan.areas && property.floorPlan.areas.length > 0 && (
        <section className={styles.plano} id="plano">
          <div className={styles.planoInner}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p className={styles.eyebrow}>Distribución</p>
              <h2 className={styles.sectionTitle}>La distribución ideal</h2>
            </div>
            <div className={styles.planoLayout}>
              {property.floorPlan.image && (
                <div className={styles.planoImg}>
                  <img src={property.floorPlan.image} alt="Plano" />
                </div>
              )}
              <div className={styles.planoTable}>
                <table className={styles.areaTable}>
                  <thead><tr><th>Ambiente</th><th>Superficie</th></tr></thead>
                  <tbody>
                    {property.floorPlan.areas.map((a: any, i: number) => (
                      <tr key={i}><td>{a.ambiente}</td><td>{a.superficie}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* GARANTÍA */}
      {property.trust && (
        <section className={styles.garantia}>
          <div className={styles.garantiaInner}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p className={styles.eyebrow}>Garantía</p>
              <h2 className={styles.sectionTitle}>Una operación segura y transparente</h2>
            </div>
            <div className={styles.garantiaGrid}>
              {property.trust.map((item: string, i: number) => (
                <div key={i} className={styles.garantiaItem}>
                  <span className={styles.garantiaCheck}><IconCheck /></span>
                  <span className={styles.garantiaText}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MEMORIA */}
      {property.brochure && (
        <section className={styles.memoria}>
          <div className={styles.memoriaInner}>
            <div className={styles.memoriaLeft}>
              <p className={styles.eyebrow}>Documentación</p>
              <h2 className={styles.memoriaTitle}>Memoria de<br />la Residencia.</h2>
              <p className={styles.memoriaDesc}>Un documento de presentación diseñado para quienes desean conocer esta propiedad en profundidad. Arquitectura, espacios, acabados y experiencia reunidos en un solo lugar.</p>
              <div className={styles.memoriaMetaRow}>
                <div className={styles.memoriaMetaItem}>
                  <span className={styles.memoriaMetaNum}>16</span>
                  <span className={styles.memoriaMetaLabel}>páginas</span>
                </div>
                <div className={styles.memoriaMetaDivider} />
                <div className={styles.memoriaMetaItem}>
                  <span className={styles.memoriaMetaNum}>PDF</span>
                  <span className={styles.memoriaMetaLabel}>descarga inmediata</span>
                </div>
              </div>
              <a href={property.brochure} download className={styles.memoriaBtn}>
                <IconDownload />Descargar Memoria
              </a>
            </div>
            {property.brochurePages && Array.isArray(property.brochurePages) && (
              <div className={styles.memoriaRight}>
                <div className={styles.memoriaDuoWrap}>
                  {property.brochurePages.map((url: string, i: number) => (
                    <div key={i} className={styles.memoriaDuoPage}>
                      <img src={url} alt={`Brochure página ${i + 1}`} />
                      <div className={styles.memoriaDuoOverlay} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CONTACTO */}
      <section className={styles.contact} id="contacto">
        <div className={styles.contactInner}>
          <div className={styles.contactAgent}>
            {agent.photo && (
              <div className={styles.agentPhoto}>
                <img src={agent.photo} alt={agent.name} onError={(e) => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
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

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLogo}>LARUM<span>STUDIO</span></div>
          <nav className={styles.footerNav}>
            {navLinks.map(l => <a key={l.href} href={l.href} className={styles.footerLink}>{l.label}</a>)}
          </nav>
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
