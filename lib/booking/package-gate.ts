/** Browser flag: user acknowledged youth training package (until billing syncs). */
export const YOUTH_TRAINING_PACKAGE_KEY = 'formula_youth_training_package_v1'

export function readHasYouthTrainingPackage(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(YOUTH_TRAINING_PACKAGE_KEY) === '1'
}

export function writeHasYouthTrainingPackage(value: boolean): void {
  if (typeof window === 'undefined') return
  if (value) window.localStorage.setItem(YOUTH_TRAINING_PACKAGE_KEY, '1')
  else window.localStorage.removeItem(YOUTH_TRAINING_PACKAGE_KEY)
}
