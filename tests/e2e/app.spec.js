import { test, expect } from '@playwright/test';

test.describe('TaskFlow App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('ajouter une tâche', async ({ page }) => {
    await page.getByPlaceholder('Ajouter une nouvelle tâche...').fill('Acheter du pain');
    await page.getByRole('button', { name: 'Ajouter' }).click();

    await expect(page.getByText('Acheter du pain')).toBeVisible();
  });

  test('cocher une tâche', async ({ page }) => {
    await page.getByPlaceholder('Ajouter une nouvelle tâche...').fill('Tâche à cocher');
    await page.getByRole('button', { name: 'Ajouter' }).click();

    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.check();

    await expect(checkbox).toBeChecked();
  });

  test('supprimer une tâche', async ({ page }) => {
    await page.getByPlaceholder('Ajouter une nouvelle tâche...').fill('Tâche à supprimer');
    await page.getByRole('button', { name: 'Ajouter' }).click();

    const taskItem = page.getByText('Tâche à supprimer');
    const container = taskItem.locator('..'); // parent
    const deleteBtn = container.getByRole('button');

    await deleteBtn.click();

    await expect(page.getByText('Tâche à supprimer')).not.toBeVisible();
  });
});