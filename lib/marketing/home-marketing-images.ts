/** Half-width homepage band photos (~2000px wide sources). Caps `sizes` so Next does not over-fetch. */
export const HOME_SPLIT_PHOTO_SIZES = '(max-width: 768px) 100vw, min(50vw, 1000px)'

/** Steve portrait is a small source; keep requested widths close to intrinsic to avoid wasted decode work. */
export const HOME_STEVE_PHOTO_SIZES = '(max-width: 768px) 100vw, min(50vw, 560px)'

export const HOME_SPLIT_PHOTO_QUALITY = 78

export const HOME_STEVE_PHOTO_QUALITY = 80
