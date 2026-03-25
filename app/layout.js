export const metadata = {
  title: 'NFT23D — Turn Any NFT Into a 3D Printed Collectible',
  description: 'Upload your NFT from any collection. We convert it to a 3D model, print it on pro-grade printers, and ship it to your door.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
