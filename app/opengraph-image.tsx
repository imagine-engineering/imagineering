import { ImageResponse } from 'next/og'

export const alt = 'imagineering — Copper for Rust; Groovy JVM tools in development'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: 72, background: '#121615', color: '#e7eceb' }}>
        <div style={{ display: 'flex', fontSize: 32 }}>imagineering</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', fontSize: 72, fontWeight: 600 }}>Focused tools for developers</div>
          <div style={{ display: 'flex', fontSize: 30, color: '#78FFA1' }}>Copper for Rust · Groovy JVM tools in development</div>
        </div>
        <div style={{ display: 'flex', fontSize: 24, color: '#B6BFBA' }}>imagine.engineering</div>
      </div>
    ),
    size,
  )
}
