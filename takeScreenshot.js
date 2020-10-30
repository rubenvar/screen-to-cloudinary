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

async function getCloudinaryFile(cloudinaryFolder, fileName) {
  const image = await cloudinary.image(fileName);
  console.log({ image });
  return false;
}

async function screenshotToCloudinary(config) {
  // is it cached already?
  //* get image from cloudinary
  const maybeFile = await getCloudinaryFile(
    config.cloudinaryFolder,
    config.fileName
  );
  if (maybeFile) {
    //* check date. if it's recent, return image url and out
    console.log(`🗄️ Cache hit. Returning screenshot from cache`);
    return proxyResponse({ url: maybeFile.url });
  }
  //* if it's old or no image, keep going
  return console.log('hasta aquí, probando');

  try {
    // take the screenshot
    const image64 = await takeTheScreenshot(config);

    // save the screenshot
    console.log(`✍️ Writing file`);
    //* upload to cluodinary
    //* get url and return it
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

// class Screenshot {
//   constructor(opts) {
//     this.folder = opts.folder;
//     this.fileName = opts.fileName;
//     this.url = opts.url;
//     this.width = opts.width;
//     this.height = opts.height;
//     this.fullPage = opts.fullPage;
//   }

//   async getFile() {}

//   async putFile() {}
// }

// class CloudinaryScreenshot extends Screenshot {
//   // constructor(opts) {
//   //   super(opts);
//   // }

//   async getFile() {
//     const image = await cloudinary.image(this.fileUrl);
//     console.log(image);
//     return false;
//   }

//   async putFile(base64) {
//     const uploadStr = `data:image/jpeg;base64,${base64}`;
//     cloudinary.uploader.upload(
//       uploadStr,
//       {
//         public_id: `${this.folder}/${this.fileName}`,
//       },
//       (err, res) => {
//         if (err) throw err;
//         this.expires = undefined;
//         console.log(res);
//         return { url: res.secureUrl, expires: this.expires };
//       }
//     );
//   }
// }

// /**
//  * put / get a screenshot to the local filesystem
//  */
// class FSScreenshot extends Screenshot {}

// module.exports = opts => {
//   if (process.env.CLOUDINARY_URL) {
//     return new CloudinaryScreenshot(opts);
//   }
//   // for local tests
//   if (process.env.TEST_WITH_LOCAL_FS) {
//     return new FSScreenshot(opts);
//   }

//   throw new Error(
//     `A required environment variable is missing. Set S3_BUCKET or TEST_WITH_LOCAL_FS and try again.`
//   );
// };
