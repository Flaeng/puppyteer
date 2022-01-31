const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    async function waitForSelectors(selectors, frame) {
      for (const selector of selectors) {
        try {
          return await waitForSelector(selector, frame);
        } catch (err) {
          console.error(err);
        }
      }
      throw new Error('Could not find element for selectors: ' + JSON.stringify(selectors));
    }

    async function waitForSelector(selector, frame) {
      if (selector instanceof Array) {
        let element = null;
        for (const part of selector) {
          if (!element) {
            element = await frame.waitForSelector(part);
          } else {
            element = await element.$(part);
          }
          if (!element) {
            throw new Error('Could not find element: ' + part);
          }
          element = (await element.evaluateHandle(el => el.shadowRoot ? el.shadowRoot : el)).asElement();
        }
        if (!element) {
          throw new Error('Could not find element: ' + selector.join('|'));
        }
        return element;
      }
      const element = await frame.waitForSelector(selector);
      if (!element) {
        throw new Error('Could not find element: ' + selector);
      }
      return element;
    }

    async function waitForElement(step, frame) {
      const count = step.count || 1;
      const operator = step.operator || '>=';
      const comp = {
        '==': (a, b) => a === b,
        '>=': (a, b) => a >= b,
        '<=': (a, b) => a <= b,
      };
      const compFn = comp[operator];
      await waitForFunction(async () => {
        const elements = await querySelectorsAll(step.selectors, frame);
        return compFn(elements.length, count);
      });
    }

    async function querySelectorsAll(selectors, frame) {
      for (const selector of selectors) {
        const result = await querySelectorAll(selector, frame);
        if (result.length) {
          return result;
        }
      }
      return [];
    }

    async function querySelectorAll(selector, frame) {
      if (selector instanceof Array) {
        let elements = [];
        let i = 0;
        for (const part of selector) {
          if (i === 0) {
            elements = await frame.$$(part);
          } else {
            const tmpElements = elements;
            elements = [];
            for (const el of tmpElements) {
              elements.push(...(await el.$$(part)));
            }
          }
          if (elements.length === 0) {
            return [];
          }
          const tmpElements = [];
          for (const el of elements) {
            const newEl = (await el.evaluateHandle(el => el.shadowRoot ? el.shadowRoot : el)).asElement();
            if (newEl) {
              tmpElements.push(newEl);
            }
          }
          elements = tmpElements;
          i++;
        }
        return elements;
      }
      const element = await frame.$$(selector);
      if (!element) {
        throw new Error('Could not find element: ' + selector);
      }
      return element;
    }

    async function waitForFunction(fn) {
      let isActive = true;
      setTimeout(() => {
        isActive = false;
      }, 5000);
      while (isActive) {
        const result = await fn();
        if (result) {
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      throw new Error('Timed out');
    }
    {
        const targetPage = page;
        await targetPage.setViewport({"width":683,"height":1311})
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        await targetPage.goto('https://docs.github1337.com/');
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Get started[role=\"link\"]"],["#main-content > div > section.container-xl.pb-lg-4.mt-6.px-3.px-md-6 > div > div > div:nth-child(1) > div > div.pt-2.mb-4.text-normal > ul > li:nth-child(1) > a"]], targetPage);
        await element.click({ offset: { x: 36, y: 11.0625} });
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        const element = await waitForSelectors([["aria/GitHub's products","aria/[role=\"generic\"]"],["#main-content > div:nth-child(2) > div > div:nth-child(1) > ul > div > li:nth-child(1) > div > div > a > h3 > span"]], targetPage);
        await element.click({ offset: { x: 91, y: 8} });
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/About GitHub's products[role=\"link\"]"],["#main-content > div > div > div.Box-sc-nv15kw-0.ArticleGridLayout__SidebarContent-sc-we7dhr-1.ULBuM.bTEPfI.border-bottom.border-xl-0.pb-4.mb-5.pb-xl-0.mb-xl-0 > div > div > ul:nth-child(1) > li > div > div > div > div > a"]], targetPage);
        await element.click({ offset: { x: 97, y: 3} });
    }
    {
        const targetPage = page;
        await targetPage.evaluate((x, y) => { window.scroll(x, y); }, 0, 359)
    }

    await browser.close();
})();
