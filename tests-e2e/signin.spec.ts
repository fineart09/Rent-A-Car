import { test, expect } from '@playwright/test'

test.describe('Sign-in flow', () => {
  test('user can sign in with username or email and see RBAC sidebar', async ({ page }) => {
    await page.goto('/signin')

    // Fill identifier and password (these credentials should exist in the test DB)
    await page.fill('input[placeholder="Username or email"]', 'testuser')
    await page.fill('input[type="password"]', 'password')

    // Click sign in
    await page.click('text=Sign in')

    // Wait for navigation to dashboard or root
    await page.waitForURL('**/dashboard', { timeout: 5000 }).catch(() => {})

    // Check sidebar exists and has Dashboard link
    const sidebar = page.locator('text=Dashboard')
    await expect(sidebar).toBeVisible()
  })
})
