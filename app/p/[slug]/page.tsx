import { notFound } from 'next/navigation';
import PropertyPage from '@/app/components/PropertyPage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Convierte un campo que puede venir como string JSON, objeto, o vacío
function parseJSON(value: any, fallback: any) {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'object') return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return parsed === null || parsed === undefined ? fallback : parsed;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  let raw;
  try {
    const res = await fetch(`${apiUrl}/propiedades/${slug}`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) return notFound();
    raw = await res.json();
  } catch {
    return notFound();
  }

  const positioning = parseJSON(raw.positioning, null);
  const lifestyle = parseJSON(raw.lifestyle, null);
  const featuresGrid = parseJSON(raw.features_grid, null);
  const cta = parseJSON(raw.cta, null);
  const planoCopy = parseJSON(raw.plano_copy, null);
  const videoMarkers = parseJSON(raw.video_markers, []);
  const galeriaPreview = parseJSON(raw.galeria_preview, {});

  const data = {
    slug: raw.slug,
    status: raw.activa === 1 ? 'active' : 'inactive',
    property: {
      name: raw.nombre,
      heroHeadline: raw.hero_headline,
      tagline: raw.tagline,
      precio: raw.precio || '',
      positioning: positioning && (positioning.paragraphs?.length || positioning.eyebrow) ? positioning : null,
      story: {
        title: raw.historia_titulo,
        paragraphs: Array.isArray(raw.historia_parrafos) ? raw.historia_parrafos : [],
      },
      location: {
        city: raw.ciudad,
        country: raw.pais,
        description: raw.ubicacion_descripcion,
        mapsUrl: raw.ubicacion_maps_url,
        mapImage: raw.ubicacion_map_image,
        landmarks: Array.isArray(raw.ubicacion_landmarks) ? raw.ubicacion_landmarks : [],
      },
      stats: {
        terreno: raw.stat_terreno,
        construidos: raw.stat_construidos,
        dormitorios: raw.stat_dormitorios,
        banos: raw.stat_banos,
      },
      videoHero: raw.video_hero,
      videoPresentacion: raw.video_presentacion,
      videoDuration: raw.video_duration,
      videoMarkers: Array.isArray(videoMarkers) ? videoMarkers : [],
      posterHero: raw.poster_url,
      lifestyle: lifestyle && (lifestyle.items?.length || lifestyle.title || lifestyle.eyebrow) ? lifestyle : null,
      featuresGrid: featuresGrid && featuresGrid.items?.length ? featuresGrid : null,
      features: (raw.features && typeof raw.features === 'object') ? raw.features : null,
      amenities: Array.isArray(raw.amenities) ? raw.amenities : [],
      trust: Array.isArray(raw.garantias) ? raw.garantias : [],
      cta: cta && (cta.title || cta.eyebrow || cta.desc) ? cta : null,
      floorPlan: {
        image: raw.plano_imagen_url,
        areas: Array.isArray(raw.plano_tabla) ? raw.plano_tabla : [],
        copy: planoCopy || null,
      },
      brochure: raw.brochure_pdf_url,
      brochurePages: Array.isArray(raw.brochure_imagenes) ? raw.brochure_imagenes : [],
      gallery: Array.isArray(raw.galeria_completa) ? raw.galeria_completa : [],
      galleryPreview: galeriaPreview || {},
      amenitiesImage: raw.amenities_image || '',
      agentEmail: raw.agente_email || '',
    },
    agent: {
      name: raw.agente_nombre || '',
      title: raw.agente_cargo || '',
      phone: raw.agente_telefono || '',
      email: raw.agente_email || '',
      whatsapp: raw.agente_whatsapp || '',
      instagram: raw.agente_instagram || '',
      photo: raw.agente_foto || '',
      authority: raw.agente_authority || '',
    },
  };

  return <PropertyPage data={data} />;
}
