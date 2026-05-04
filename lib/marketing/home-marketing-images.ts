/** Half-width homepage band photos - cap `sizes` so Next requests smaller widths (less bytes, faster). */
export const HOME_SPLIT_PHOTO_SIZES = '(max-width: 768px) 100vw, min(50vw, 840px)'

/** Above-the-fold split (first large photo in the document). */
export const HOME_SPLIT_PHOTO_QUALITY = 72

/** Below-the-fold splits: smaller files, faster scroll performance. */
export const HOME_SPLIT_PHOTO_QUALITY_DEFERRED = 66
