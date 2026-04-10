/** Half-width homepage band photos — cap `sizes` so Next requests smaller widths (less bytes, faster). */
export const HOME_SPLIT_PHOTO_SIZES = '(max-width: 768px) 100vw, min(50vw, 840px)'

/** Steve portrait — avoid requesting much wider than the column needs. */
export const HOME_STEVE_PHOTO_SIZES = '(max-width: 768px) 100vw, min(50vw, 520px)'

/** Slightly lower quality on large splits = smaller files; still sharp at typical viewport widths. */
export const HOME_SPLIT_PHOTO_QUALITY = 72

export const HOME_STEVE_PHOTO_QUALITY = 75
