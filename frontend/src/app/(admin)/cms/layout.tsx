export const metadata = {
  title: 'CMS',
  description: 'CMS for Assume Breach',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
