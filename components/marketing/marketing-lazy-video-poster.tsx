'use client'

import Image from 'next/image'

/** Static poster behind copy until lazy video mounts (avoids empty flat color; helps paint). */
export function MarketingLazyVideoPosterLayer({ src, ready }: { src: string; ready: boolean }) {
  if (ready) return null
  return (
    <div className="absolute inset-0 overflow-hidden bg-formula-deep" aria-hidden>
      <Image
        src={src}
        alt=""
        fill
        className="scale-[1.01] object-cover"
        sizes="100vw"
        quality={62}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
