const fs = require(`fs`);
const fsPromises = require(`fs`).promises;
const path = require(`path`);
const chromium = require(`chrome-aws-lambda`);
const cloudinary = require('cloudinary').v2;
const { proxyResponse, proxyError } = require('./proxy');

let browser = null;

// try to search and get the local file
async function getLocalFile(fileUrl) {
  try {
    await fsPromises.access(fileUrl);
    return { url: fileUrl };
  } catch (error) {
    return false;
  }
}

// try to save file to local (./screenshots)
async function saveFileToLocal(base64, fileUrl) {
  try {
    await fsPromises.writeFile(fileUrl, base64, { encoding: 'base64' });
    return { url: fileUrl };
  } catch (error) {
    throw error;
  }
}

// main common function to take the screenshot
async function takeTheScreenshot(config) {
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
    deviceScaleFactor: 2,
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

async function screenshotToLocal(config) {
  const dir = path.join(__dirname, `screenshots`);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  const fileUrl = path.join(dir, config.fileName);

  // is it cached already?
  const maybeFile = await getLocalFile(fileUrl);
  if (maybeFile) {
    console.log(`🗄️ Cache hit. Returning screenshot from cache`);
    return proxyResponse({ url: maybeFile.url });
  }

  try {
    // take the screenshot
    const image64 = await takeTheScreenshot(config);

    // save the screenshot
    console.log(`✍️ Writing file`);
    const saved = await saveFileToLocal(image64, fileUrl);
    return proxyResponse({ url: saved.url });
  } catch (error) {
    return proxyError(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}

async function saveFileToCloudinary(base64, folder, fileName) {
  const uploadStr = `data:image/jpeg;base64,${base64}`;
  const config = {
    public_id: `${folder}/${fileName}`,
  };

  cloudinary.uploader.upload(uploadStr, config, (err, res) => {
    if (err) throw err;
    console.log({ 'Cloudinary Image Payload': res });
    return { url: res.secureUrl };
  });
}

async function screenshotToCloudinary(config) {
  // not checking for cache 🙈

  try {
    // take the screenshot
    const image64 = await takeTheScreenshot(config);
    // save the screenshot
    console.log(`✍️ Writing file`);
    const saved = await saveFileToCloudinary(
      image64,
      config.cloudinaryFolder,
      config.fileName
    );
    return proxyResponse({ url: saved.url });
  } catch (error) {
    return proxyError(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}

exports.screenshotToLocal = screenshotToLocal;
exports.screenshotToCloudinary = screenshotToCloudinary;
