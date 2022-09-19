const chromium = require(`@sparticuz/chrome-aws-lambda`);

// main common function to take the screenshot
async function takeScreenshot(config) {
  let browser = null;

  // set up puppeteer
  console.log('🤖 Setting up browser');
  browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  // start browser
  console.log(`🚪 Opening browser`);
  const page = await browser.newPage();
  await page.setViewport({
    width: config.width,
    height: config.height,
    // deviceScaleFactor: 2, no need
  });

  // photooo!
  console.log(`📷 Taking screenshot`);
  await page.goto(config.url, { waitUntil: [`networkidle2`] });
  await page.waitForTimeout(1000); // wait for full-size images to fade in
  const image64 = await page.screenshot({
    fullPage: config.fullPage,
    encoding: 'base64',
  });

  // bye
  console.log(`🚀 Closing and returning screenshot`);
  await page.close();
  await browser.close();

  return image64;
}

module.exports = takeScreenshot;
