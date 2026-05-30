'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import PropertyPage from '../../components/PropertyPage'
import sanBernardino from '../../data/properties/san-bernardino.json'

const PROPERTIES: Record<string, any> = {
  'san-bernardino': sanBernardino,
}

export default function Page() {
  const params = useParams()
  const slug = params?.slug as string
  const data = PROPERTIES[slug]
  if (!data) return <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>No encontrado</div>
  return <PropertyPage data={data} />
}
