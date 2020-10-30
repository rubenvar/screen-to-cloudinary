const fs = require(`fs`);
const fsPromises = require(`fs`).promises;
const path = require(`path`);

const { proxyResponse, proxyError } = require('./proxy');
const takeScreenshot = require('./takeScreenshot');

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

async function screenshotToLocal(config) {
  const dir = path.join(__dirname, '..', `screenshots`);
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
    const image64 = await takeScreenshot(config);
    // save the screenshot
    console.log(`✍️ Writing file`);
    const saved = await saveFileToLocal(image64, fileUrl);
    return proxyResponse({ url: saved.url });
  } catch (error) {
    return proxyError(error);
  }
}

module.exports = screenshotToLocal;
