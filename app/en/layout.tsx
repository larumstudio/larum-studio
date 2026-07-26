import React from 'react'
import HtmlLangSetter from '../components/HtmlLangSetter'

export default function EnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <HtmlLangSetter lang="en" />
      <div lang="en">{children}</div>
    </>
  )
}
