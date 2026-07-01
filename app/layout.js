export const metadata = {
  metadataBase: new URL('https://sloancraft.com'),
  title: 'Sloan Craft — 3D Prints by Elliot Sloan',
  description: 'Custom collectible sculptures and miniature replicas of the ramps that built skateboarding — designed, printed, and hand-painted in Vista, California.',
  openGraph: {
    title: 'Sloan Craft — 3D Prints by Elliot Sloan',
    description: 'Scaled replicas of iconic skate ramps and custom collectible sculptures, made in-house in Vista, California.',
    url: 'https://sloancraft.com',
    siteName: 'Sloan Craft',
    images: [{ url: '/images/mega-park.jpg', width: 1400, height: 1050, alt: 'Sloan Craft 3D printed ramp' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sloan Craft — 3D Prints by Elliot Sloan',
    description: 'Scaled replicas of iconic skate ramps and custom collectible sculptures, made in-house in Vista, California.',
    images: ['/images/mega-park.jpg'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
