// Import utils
import helper from '@utils/helpers';
import testContext from '@utils/testContext';

// Import common tests
import {installHummingbird, uninstallHummingbird} from '@commonTests/BO/design/hummingbird';

// Import pages
import categoryPage from '@pages/FO/hummingbird/category';
import homePage from '@pages/FO/hummingbird/home';

import {expect} from 'chai';
import type {BrowserContext, Page} from 'playwright';
import {
  dataCategories,
  FakerCategory,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_hummingbird_menuAndNavigation_navigateInCategories_sideBlockCategories';

describe('FO - Menu and Navigation : Side block categories', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  // Pre-condition : Install Hummingbird
  installHummingbird(`${baseContext}_preTest`);

  // before and after functions
  before(async function () {
    browserContext = await helper.createBrowserContext(this.browser);
    page = await helper.newTab(browserContext);
  });

  after(async () => {
    await helper.closeBrowserContext(browserContext);
  });

  describe('Check Side block categories', async () => {
    it('should go to FO home page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToFO', baseContext);

      await homePage.goToFo(page);

      const isHomePage = await homePage.isHomePage(page);
      expect(isHomePage).to.eq(true);
    });

    [
      {
        parent: dataCategories.accessories,
        child: dataCategories.stationery,
      },
      {
        parent: dataCategories.clothes,
        child: dataCategories.women,
      },
      {
        parent: dataCategories.art,
      },
    ].forEach((arg: { parent: FakerCategory, child?: FakerCategory }, index: number) => {
      it(`should click on category '${arg.parent.name}'`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', `goToCategory${index}`, baseContext);

        await homePage.goToCategory(page, arg.parent.id);

        const pageTitle = await homePage.getPageTitle(page);
        expect(pageTitle).to.equal(arg.parent.name);
      });

      it(`should check category block '${arg.parent.name}'`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', `checkCategory${index}`, baseContext);

        const hasBlockCategories = await categoryPage.hasBlockCategories(page);
        expect(hasBlockCategories).to.equal(true);

        const numBlockCategories = await categoryPage.getNumBlockCategories(page);
        expect(numBlockCategories).to.equal(arg.parent.children.length);
      });

      if (arg.child) {
        it(`should click on category '${arg.child.name}' in sideBlock`, async function () {
          await testContext.addContextItem(this, 'testIdentifier', `goToSideBlock${index}`, baseContext);

          await categoryPage.clickBlockCategory(page, arg.child!.name);

          const pageTitle = await homePage.getPageTitle(page);
          expect(pageTitle).to.equal(arg.child!.name);
        });

        it(`should check category block '${arg.child.name}'`, async function () {
          await testContext.addContextItem(this, 'testIdentifier', `checkSubCategory${index}`, baseContext);

          const hasBlockCategories = await categoryPage.hasBlockCategories(page);
          expect(hasBlockCategories).to.equal(true);

          const numBlockCategories = await categoryPage.getNumBlockCategories(page);
          expect(numBlockCategories).to.equal(0);
        });
      }
    });
  });

  // Post-condition : Uninstall Hummingbird
  uninstallHummingbird(`${baseContext}_postTest`);
});
