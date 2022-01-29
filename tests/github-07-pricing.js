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
        await targetPage.goto('https://github.com/');
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Toggle navigation","aria/[role=\"graphics-symbol\"]"],["body > div.position-relative.js-header-wrapper > header > div > div.d-flex.flex-justify-between.flex-items-center > div.d-flex.flex-items-center > button > svg > path"]], targetPage);
        await element.click({ offset: { x: 17.515625, y: 8} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Global","aria/Pricing"],["body > div.position-relative.js-header-wrapper > header > div > div.HeaderMenu.HeaderMenu--logged-out.position-fixed.top-0.right-0.bottom-0.height-fit.position-lg-relative.d-lg-flex.flex-justify-between.flex-items-center.flex-auto > nav > ul > li:nth-child(6) > details > summary"]], targetPage);
        await element.click({ offset: { x: 176, y: 26} });
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        const element = await waitForSelectors([["aria/Compare plans"],["body > div.position-relative.js-header-wrapper > header > div > div.HeaderMenu.HeaderMenu--logged-out.position-fixed.top-0.right-0.bottom-0.height-fit.position-lg-relative.d-lg-flex.flex-justify-between.flex-items-center.flex-auto > nav > ul > li:nth-child(6) > details > div > ul > li:nth-child(2) > a"]], targetPage);
        await element.click({ offset: { x: 72, y: 12} });
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        await targetPage.evaluate((x, y) => { window.scroll(x, y); }, 0, 6204)
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        const element = await waitForSelectors([["aria/Open source teams If you manage multiple contributors, there’s a free option. We also run GitHub Sponsors, where we help fund your work."],["#audiences > div > div.d-flex.flex-column.flex-md-row.gutter.js-build-in-trigger.px-lg-4.build-in-animate > div:nth-child(1) > a"]], targetPage);
        await element.click({ offset: { x: 254.4931983947754, y: 142.41236877441406} });
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        const element = await waitForSelectors([["aria/Sign up for free"],["body > div.application-main > main > div.js-build-in.position-relative.overflow-hidden.section-team-hero.build-in-animate > div.position-relative.position-md-absolute.top-md-0.right-md-0.bottom-md-0.left-md-0.z-1 > div > div > div > a"]], targetPage);
        await element.click({ offset: { x: 102.40625, y: 28.375} });
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Username*"],["#user_login"]], targetPage);
        const type = await element.evaluate(el => el.type);
        if (["textarea","select-one","text","url","tel","search","password","number","email"].includes(type)) {
          await element.type('testtesttesttesttesttestasddf');
        } else {
          await element.focus();
          await element.evaluate((el, value) => {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, "testtesttesttesttesttestasddf");
        }
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Email address*"],["#user_email"]], targetPage);
        await element.click({ offset: { x: 240, y: 17} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Email address*"],["#user_email"]], targetPage);
        await element.click({ offset: { x: 67, y: 10} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Email address*"],["#user_email"]], targetPage);
        const type = await element.evaluate(el => el.type);
        if (["textarea","select-one","text","url","tel","search","password","number","email"].includes(type)) {
          await element.type('test@tes123t.dk');
        } else {
          await element.focus();
          await element.evaluate((el, value) => {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, "test@tes123t.dk");
        }
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Password*"],["#user_password"]], targetPage);
        await element.click({ offset: { x: 181, y: 12} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Password*"],["#user_password"]], targetPage);
        const type = await element.evaluate(el => el.type);
        if (["textarea","select-one","text","url","tel","search","password","number","email"].includes(type)) {
          await element.type('123123123123');
        } else {
          await element.focus();
          await element.evaluate((el, value) => {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, "123123123123");
        }
    }

    await browser.close();
})();
