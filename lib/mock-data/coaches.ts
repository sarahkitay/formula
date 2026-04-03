// TEMPORARY DATA LAYER (V1)
// Replace with: const { data } = await supabase.from('coaches').select('*')
import { Coach } from '@/types'

export const mockCoaches: Coach[] = [
  {
    id: 'coach-1',
    firstName: 'Marcus',
    lastName: 'Rivera',
    email: 'marcus.rivera@formulafc.com',
    phone: '(555) 201-4432',
    specializations: ['Technical Skills', 'U12–U14 Development'],
    assignedGroups: ['group-1', 'group-2'],
    bio: 'Former MLS academy coach with 12 years of youth development experience.',
    certifications: ['UEFA B License', 'US Soccer National D'],
    status: 'active',
    joinedAt: '2022-03-15T00:00:00Z',
  },
  {
    id: 'coach-2',
    firstName: 'Elena',
    lastName: 'Vasquez',
    email: 'elena.vasquez@formulafc.com',
    phone: '(555) 309-7721',
    specializations: ['Goalkeeper Training', 'U16–U18'],
    assignedGroups: ['group-3', 'group-4'],
    bio: 'Former collegiate goalkeeper. Specialist in GK development and positioning.',
    certifications: ['NSCAA Advanced National', 'GK Specialist Cert'],
    status: 'active',
    joinedAt: '2023-01-08T00:00:00Z',
  },
  {
    id: 'coach-3',
    firstName: 'Jordan',
    lastName: 'Kim',
    email: 'jordan.kim@formulafc.com',
    phone: '(555) 418-6654',
    specializations: ['Speed & Agility', 'U8–U10'],
    assignedGroups: ['group-5'],
    bio: 'Sports performance specialist with a background in athletic training.',
    certifications: ['CSCS', 'US Soccer Grassroots D'],
    status: 'active',
    joinedAt: '2023-06-20T00:00:00Z',
  },
]

export function getCoachById(id: string): Coach | undefined {
  return mockCoaches.find(c => c.id === id)
}
