import { test, expect } from '@playwright/test';
import { SbPage } from './util';

const storybookUrl = process.env.STORYBOOK_URL || 'http://localhost:8001';

test.describe('tags', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(storybookUrl);
    await new SbPage(page).waitUntilLoaded();
  });

  test('should correctly filter dev-only, docs-only, test-only stories', async ({ page }) => {
    const sbPage = new SbPage(page);

    await sbPage.navigateToStory('lib/preview-api/tags', 'docs');

    // Sidebar should include dev-only and exclude docs-only and test-only
    const devOnlyEntry = await page.locator('#lib-preview-api-tags--dev-only').all();
    expect(devOnlyEntry.length).toBe(1);

    const docsOnlyEntry = await page.locator('#lib-preview-api-tags--docs-only').all();
    expect(docsOnlyEntry.length).toBe(0);

    const testOnlyEntry = await page.locator('#lib-preview-api-tags--test-only').all();
    expect(testOnlyEntry.length).toBe(0);

    // Autodocs should include docs-only and exclude dev-only and test-only
    const root = sbPage.previewRoot();

    const devOnlyAnchor = await root.locator('#anchor--lib-preview-api-tags--dev-only').all();
    expect(devOnlyAnchor.length).toBe(0);

    const docsOnlyAnchor = await root.locator('#anchor--lib-preview-api-tags--docs-only').all();
    expect(docsOnlyAnchor.length).toBe(1);

    const testOnlyAnchor = await root.locator('#anchor--lib-preview-api-tags--test-only').all();
    expect(testOnlyAnchor.length).toBe(0);
  });

  test('should correctly filter out test-only autodocs pages', async ({ page }) => {
    const sbPage = new SbPage(page);
    await sbPage.selectToolbar('#lib-preview-api');

    // Sidebar should exclude test-only stories and their docs
    const componentEntry = await page.locator('#lib-preview-api-test-only-tag').all();
    expect(componentEntry.length).toBe(0);
  });
});
