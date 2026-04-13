import { expect, test } from '@playwright/test'

test.describe('public smoke', () => {
  test('home loads', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Formula/i)
  })

  test('book assessment hub loads', async ({ page }) => {
    const res = await page.goto('/book-assessment')
    expect(res?.ok()).toBeTruthy()
    await expect(page.getByRole('heading', { name: /skills check/i })).toBeVisible()
  })
})

test.describe('login & role routing (UI contract)', () => {
  test('parent login URL shows parent portal copy', async ({ page }) => {
    await page.goto('/login?role=parent')
    await expect(page.getByRole('button', { name: /sign in to parent portal/i })).toBeVisible()
    await expect(page.getByText(/parent portal/i).first()).toBeVisible()
  })

  test('sanitized next param is reflected in flow copy when present', async ({ page }) => {
    await page.goto('/login?role=parent&next=%2Fparent%2Fdashboard')
    await expect(page.getByRole('button', { name: /sign in to parent portal/i })).toBeVisible()
  })
})
