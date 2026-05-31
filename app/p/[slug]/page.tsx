import { notFound } from 'next/navigation';
import PropertyPage from '@/app/components/PropertyPage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  let data;
  try {
    const res = await fetch(`${apiUrl}/propiedades/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return notFound();
    data = await res.json();
  } catch {
    return notFound();
  }

  return <PropertyPage data={data} />;
}
