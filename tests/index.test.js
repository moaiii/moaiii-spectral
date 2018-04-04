const puppeteer = require('puppeteer');

let pages = ['boy', 'girl', 'soul'];

let browser;
let page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false
  });
  page = await browser.newPage();
  await page.goto('http://localhost:5555/');
});

afterEach(async () => {
  // await browser.close();
});

describe('Checking the pages have the correct titles', () => {
  test('We have landed at the home page', async () => {
    let url = await page.url();
    let headerText = await page.$eval('.main-logo', el => el.textContent);
    await browser.close();
    expect(headerText).toEqual('SPECTRAL');
  })

  test('last next arrow links back to song 1', async () => {
    let link = `http://localhost:5555/song/${pages.length}`;
    await page.goto(link);
    await page.waitFor(`a[href="/song/1"]`);
    await page.click(`a[href="/song/1"]`);
    let url = await page.url();
    await browser.close();
    expect(url).toMatch(/1/);
  });

  test('Each page has the correct title', async () => {
    pages.forEach(async (title, index) => {
      let pageNum = index + 1;
      let link = `http://localhost:5555/song/${pageNum}`;
      await page.goto(link);
      let headerText = await page.$eval('.moai-header', el => el.textContent);
      await browser.close();
      expect(headerText).toEqual(pages[index]);
    })
  });
});