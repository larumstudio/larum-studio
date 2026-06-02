import { notFound } from 'next/navigation';
import PropertyPage from '@/app/components/PropertyPage';
interface PageProps {
  params: Promise<{ slug: string }>;
}
export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  let raw;
  try {
    const res = await fetch(`${apiUrl}/propiedades/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return notFound();
    raw = await res.json();
  } catch {
    return notFound();
  }
  const data = {
    slug: raw.slug,
    status: raw.activa === 1 ? 'active' : 'inactive',
    property: {
      name: raw.nombre,
      tagline: raw.tagline,
      precio: raw.precio || '',
      story: {
        title: raw.historia_titulo,
        paragraphs: raw.historia_parrafos || [],
      },
      location: {
        city: raw.ciudad,
        country: raw.pais,
        description: raw.ubicacion_descripcion,
        mapsUrl: raw.ubicacion_maps_url,
        landmarks: raw.ubicacion_landmarks || [],
      },
      stats: {
        terreno: raw.stat_terreno,
        construidos: raw.stat_construidos,
        dormitorios: raw.stat_dormitorios,
        banos: raw.stat_banos,
      },
      videoHero: raw.video_hero,
      videoPresentacion: raw.video_presentacion,
      posterHero: raw.poster_url,
      galleryPreview: raw.galeria_preview || {},
      featuresGrid: raw.caracteristicas || {},
      features: raw.features || {},
      amenities: raw.amenities || [],
      trust: raw.garantias || [],
      floorPlan: {
        image: raw.plano_imagen_url,
        areas: raw.plano_tabla || [],
      },
      brochure: raw.brochure_pdf_url,
      brochurePages: raw.brochure_imagenes || [],
      gallery: raw.galeria_completa || [],
      amenitiesImage: raw.amenities_image || '',
    },
    agent: {
      name: raw.agente_nombre || '',
      title: raw.agente_cargo || '',
      phone: raw.agente_telefono || '',
      email: raw.agente_email || '',
      whatsapp: raw.agente_whatsapp || '',
      instagram: raw.agente_instagram || '',
      photo: raw.agente_foto || '',
    },
  };
  return <PropertyPage data={data} />;
}