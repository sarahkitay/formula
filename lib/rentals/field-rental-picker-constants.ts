/** Shared with field rental + party booking flows (marketing). */

export const RENTAL_TIME_SLOTS = [
  '6:00 AM - 7:00 AM',
  '7:15 AM - 8:15 AM',
  '8:30 AM - 9:30 AM',
  '9:45 AM - 10:45 AM',
  '11:00 AM - 12:00 PM',
  '12:15 PM - 1:15 PM',
  '1:30 PM - 2:30 PM',
  '2:45 PM - 3:45 PM',
  '4:00 PM - 5:00 PM',
  '5:15 PM - 6:15 PM',
  '6:30 PM - 7:30 PM',
  '7:45 PM - 8:45 PM',
] as const

export const RENTAL_FIELD_OPTIONS = [
  { value: 'field_a', label: 'Field A (turf)' },
  { value: 'field_b', label: 'Field B (turf)' },
  { value: 'field_indoor', label: 'Indoor / small-sided' },
] as const
