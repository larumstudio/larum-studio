/* ============================================================
   app/p/[slug]/page.tsx  —  MULTI-PROPIEDAD  (SUSTITUIR)

   Mantiene el comportamiento actual y añade lang.
   ============================================================ */
import PropertyPage from '../../components/PropertyPage'
import data from '../../data/property.json'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  await params
  return <PropertyPage data={data} lang="es" />
}
