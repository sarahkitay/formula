// @vitest-environment happy-dom

import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  readHasYouthTrainingPackage,
  writeHasYouthTrainingPackage,
  YOUTH_TRAINING_PACKAGE_KEY,
} from '@/lib/booking/package-gate'

describe('package-gate (localStorage)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('reads false when unset', () => {
    expect(readHasYouthTrainingPackage()).toBe(false)
  })

  it('writes and reads package flag', () => {
    writeHasYouthTrainingPackage(true)
    expect(localStorage.getItem(YOUTH_TRAINING_PACKAGE_KEY)).toBe('1')
    expect(readHasYouthTrainingPackage()).toBe(true)
  })

  it('clears flag when set to false', () => {
    writeHasYouthTrainingPackage(true)
    writeHasYouthTrainingPackage(false)
    expect(localStorage.getItem(YOUTH_TRAINING_PACKAGE_KEY)).toBeNull()
    expect(readHasYouthTrainingPackage()).toBe(false)
  })
})
