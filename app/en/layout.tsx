/* ============================================================
   app/en/layout.tsx  —  ARCHIVO NUEVO

   Marca el subárbol inglés. El <html lang> se queda en el
   layout raíz; este envuelve solo las rutas /en/*.
   ============================================================ */
import React from 'react'

export default function EnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div lang="en">{children}</div>
}
