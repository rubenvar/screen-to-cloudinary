require('dotenv').config();
const { proxyError } = require('./utils/proxy');
const screenshotToLocal = require('./utils/screenshotToLocal');
const screenshotToCloudinary = require('./utils/screenshotToCloudinary');
const packageJson = require('./package.json');

// exports.handler = async (event, context) => {
exports.handler = async (event) => {
  let takeScreenshot;
  const request = event.body ? JSON.parse(event.body) : {};

  // TODO check if valid url
  if (!request.url) {
    return proxyError(`no url provided to take screenshot of`);
  }

  // check if there is a correct Cloudinary URL, or it's just a local test
  if (request.cloudinaryUrl) {
    takeScreenshot = screenshotToCloudinary;
  } else if (process.env.TEST_WITH_LOCAL_FS) {
    takeScreenshot = screenshotToLocal;
  } else {
    throw new Error(
      `A valid Cloudinary URL is missing. Either pass it in the config, or set the TEST_WITH_LOCAL_FS environment variable to test it, and try again.`
    );
  }

  const config = {
    url: request.url,
    cloudinaryUrl: request.cloudinaryUrl,
    cloudinaryFolder: request.cloudinaryFolder || 'default',
    fileName: `${request.fileName || `default-${Date.now()}`}${
      request.cloudinaryUrl ? '' : '.jpg'
    }`,
    width: request.width || 1024,
    height: request.height || 768,
    fullPage: request.fullPage || false,
  };

  // start
  console.log(`Invoked (v${packageJson.version}): ${config.url}`);

  const screenshotResult = await takeScreenshot(config);

  console.log(`response: ${JSON.stringify(screenshotResult)}`);
  return screenshotResult;
};
