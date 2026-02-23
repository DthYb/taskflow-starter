import { test, expect } from '@playwright/test';

test.describe('TaskFlow App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should add a task and display it', async ({ page }) => {
    await page.fill('input[type="text"]', 'Acheter du pain');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Acheter du pain')).toBeVisible();
  });

  test('should toggle a task as completed', async ({ page }) => {
    await page.fill('input[type="text"]', 'Tâche à cocher');
    await page.click('button[type="submit"]');

    await page.click('input[type="checkbox"]');
    await expect(page.locator('input[type="checkbox"]')).toBeChecked();
  });

  test('should delete a task', async ({ page }) => {
    await page.fill('input[type="text"]', 'Tâche à supprimer');
    await page.click('button[type="submit"]');

    await page.click('button.delete, button[aria-label="Delete"]');
    await expect(page.locator('text=Tâche à supprimer')).not.toBeVisible();
  });
});