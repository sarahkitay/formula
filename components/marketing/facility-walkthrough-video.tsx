'use client'

import { useCallback, useState } from 'react'
import { useLazyAutoplayVideo } from '@/lib/marketing/use-lazy-autoplay-video'

const SRC_MP4 = '/IMG_6200_5.mp4'

/**
 * Facility walkthrough (MP4). Mounted only when near the viewport so the homepage and upper facility page stay light.
 */
export function FacilityWalkthroughVideo() {
  const [failed, setFailed] = useState(false)
  const { containerRef, videoRef, ready } = useLazyAutoplayVideo()

  const onError = useCallback(() => {
    setFailed(true)
  }, [])

  if (failed) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-black/90 px-6 py-10 text-center">
        <p className="max-w-md text-[14px] leading-relaxed text-formula-frost/85">
          This browser couldn&apos;t play the facility video. Use an MP4 with{' '}
          <strong className="font-medium text-formula-paper">H.264 video and AAC audio</strong> and keep it at{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[12px] text-formula-volt/90">public/IMG_6200_5.mp4</code>.
        </p>
        <a
          href={SRC_MP4}
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt underline-offset-4 hover:underline"
          download
        >
          Download video file →
        </a>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative aspect-video w-full bg-black">
      {ready ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          controls
          preload="none"
          aria-label="Formula Soccer Center facility walkthrough video"
          onError={onError}
        >
          <source src={SRC_MP4} type="video/mp4" />
        </video>
      ) : (
        <div className="absolute inset-0 bg-formula-deep" aria-hidden />
      )}
    </div>
  )
}
