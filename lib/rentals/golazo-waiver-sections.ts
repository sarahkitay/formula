/**
 * Golazo Soccer Center LLC d/b/a Formula Soccer — release text for field rental waivers.
 * Used by the public legal document, PDF export, and admin detail.
 */

export type GolazoBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: readonly string[] }

export type GolazoSection = {
  readonly n: number
  readonly title: string
  readonly blocks: readonly GolazoBlock[]
}

export const GOLAZO_WAIVER_DOC_TITLE =
  'RELEASE OF LIABILITY, ASSUMPTION OF RISK, AND INDEMNIFICATION AGREEMENT' as const

export const GOLAZO_WAIVER_ENTITY_LINES = [
  'GOLAZO SOCCER CENTER LLC',
  'aka FORMULA SOCCER',
  '15001 Calvert St., Van Nuys, CA 91411',
] as const

/** Shown above the participant form fields — ties blanks to the agreement. */
export const GOLAZO_WAIVER_PARTICIPANT_HEADER =
  'Participant name, date of birth, address, phone, and emergency contact name & phone (as stated above) are part of this agreement.' as const

export const GOLAZO_WAIVER_SIGNING_BLOCK = [
  'BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ THIS AGREEMENT, UNDERSTAND ITS TERMS, UNDERSTAND THAT I AM RELEASING IMPORTANT LEGAL RIGHTS (INCLUDING THE RIGHT TO SUE FOR NEGLIGENCE), AND I SIGN IT VOLUNTARILY.',
] as const

export const GOLAZO_WAIVER_SECTIONS: readonly GolazoSection[] = [
  {
    n: 1,
    title: 'Acknowledgment of Risks',
    blocks: [
      {
        type: 'p',
        text: 'I acknowledge that participation in indoor soccer, training, drills, leagues, camps, parties, and related activities (collectively, “Activities”) at Golazo Soccer Center LLC aka Formula Soccer (“Facility”) involves inherent and other risks, including but not limited to:',
      },
      {
        type: 'ul',
        items: [
          'Inherent Physical Injuries (Soccer-Specific): lower extremity injuries (ankle sprains, knee injuries including ACL/MCL tears, meniscus tears, groin/hamstring/calf strains), head and neck trauma (concussions and other brain injuries from collisions, balls to the head, or falls on hard/artificial turf), upper body injuries (fractures, dislocations, wrist/shoulder sprains from falls or collisions with boards/walls), and overuse injuries (tendonitis, stress fractures, shin splints from repetitive/high-impact movements on artificial surfaces).',
          'Environmental and Facility-Specific Risks: slipping, tripping, or falling on turf or uneven/slick surfaces (sweat, spills), collisions with or falls caused by boards/dasher boards/netting, unsecured or falling goals, equipment failure or malfunction, improper maintenance of playing surfaces, poor lighting or ventilation.',
          'Participant Interaction and Behavioral Risks: collisions or contact with other participants resulting from aggressive or reckless play, risks from inadequate supervision or instruction, and conduct by other participants.',
          'Medical and Public Health Risks: cardiovascular events, heat-related illness, infectious diseases (including but not limited to COVID-19, MRSA, influenza), and the unavailability of immediate on-site medical care.',
        ],
      },
      {
        type: 'p',
        text: 'I understand these risks can result in serious injury, permanent disability, or death, and I freely accept and assume all such risks, whether known or unknown.',
      },
    ],
  },
  {
    n: 2,
    title: 'Release and Waiver of Liability (Including Negligence)',
    blocks: [
      {
        type: 'p',
        text: 'In consideration for being permitted to participate in Activities and use the Facility, I, on behalf of myself and my heirs, executors, administrators, personal representatives, successors and assigns, hereby RELEASE, WAIVE, DISCHARGE, AND COVENANT NOT TO SUE Golazo Soccer Center LLC aka Formula Soccer, its owners, members, managers, officers, employees, agents, volunteers, independent contractors, affiliates, and representatives (collectively, the “Released Parties”) from any and all liability, claims, demands, causes of action, or damages of any kind arising out of or related to my participation in Activities or my presence on Facility premises, INCLUDING CLAIMS ARISING OUT OF THE NEGLIGENCE (ACTIVE OR PASSIVE) OF THE RELEASED PARTIES, TO THE FULLEST EXTENT PERMITTED BY CALIFORNIA LAW.',
      },
    ],
  },
  {
    n: 3,
    title: 'Indemnification and Defense',
    blocks: [
      {
        type: 'p',
        text: 'I agree to INDEMNIFY, DEFEND, AND HOLD HARMLESS the Released Parties from and against any and all claims, liabilities, losses, damages, costs, and expenses (including reasonable attorneys’ fees and costs) arising out of or resulting from my negligent, reckless, or intentional acts or omissions in connection with my participation in Activities or use of Facility premises or equipment.',
      },
    ],
  },
  {
    n: 4,
    title: 'Acknowledgment Regarding Minors',
    blocks: [
      {
        type: 'p',
        text: 'If the Participant is under 18 years of age, a parent or legal guardian must sign below. By signing, the parent/guardian confirms they have authority to do so, have read and understood this Agreement, and consent to the child’s participation and the terms of this Agreement on behalf of the child and the child’s heirs and guardians.',
      },
    ],
  },
  {
    n: 5,
    title: 'Medical Treatment and Assumption of Medical Costs',
    blocks: [
      {
        type: 'p',
        text: 'I consent to medical care and treatment deemed necessary by authorized Facility personnel or medical providers in the event of injury or illness, and I accept responsibility for any costs of such care or transportation.',
      },
    ],
  },
  {
    n: 6,
    title: 'Fitness; Rules; Withdrawal',
    blocks: [
      {
        type: 'p',
        text: 'I represent that I am physically able to participate and will inform Facility staff of any medical condition that could affect safe participation. I agree to follow all Facility rules, posted instructions, and staff directions. The Facility may remove or refuse participation to any person whose conduct is unsafe or disruptive without refund.',
      },
    ],
  },
  {
    n: 7,
    title: 'Photography, Video, and Media Release',
    blocks: [
      {
        type: 'p',
        text: 'I grant the Facility permission to photograph or record me and to use such images and recordings for promotional, advertising, training, or instructional purposes without compensation, unless I provide written notice otherwise.',
      },
    ],
  },
  {
    n: 8,
    title: 'California Law; Severability; Entire Agreement',
    blocks: [
      {
        type: 'p',
        text: 'This Agreement shall be governed by California law. If any provision is held unenforceable, the remainder remains in effect. This instrument is intended to be broad and inclusive and constitutes the entire agreement between the parties relating to its subject matter.',
      },
    ],
  },
] as const
