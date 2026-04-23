/**
 * Legacy barrel: the booking hub UI now lives in split routes under `/book-assessment/*`.
 * Prefer importing `BookAssessmentHub`, skills/contact clients, or types directly.
 */
export type { BookAssessmentVariant } from '@/components/marketing/book-assessment-types'
export { BookAssessmentHub } from '@/components/marketing/book-assessment-hub'
