require('dotenv').config();
const { proxyResponse, proxyError } = require('./utils/proxy');
const screenshotToLocal = require('./utils/screenshotToLocal');
const screenshotToCloudinary = require('./utils/screenshotToCloudinary');

// exports.handler = async (event, context) => {
exports.handler = async (event) => {
  let takeScreenshot;

  const request = event.body ? JSON.parse(event.body) : {};

  if (!request.url) {
    return proxyError(`no url provided`);
  }

  // TODO allow to pass a cloudinary account url as param to make it fully configurable
  const config = {
    cloudinaryFolder: request.cloudinaryFolder || 'default',
    fileName: `${request.fileName || `default-${Date.now()}`}${
      process.env.CLOUDINARY_URL ? '' : '.jpg'
    }`,
    url: request.url,
    width: request.width || 1024,
    height: request.height || 768,
    fullPage: request.fullPage || false,
  };

  // check if it's just a local test, or if there is a correct Cloudinary URL
  if (process.env.CLOUDINARY_URL) {
    takeScreenshot = screenshotToCloudinary;
  } else if (process.env.TEST_WITH_LOCAL_FS) {
    takeScreenshot = screenshotToLocal;
  } else {
    throw new Error(
      `A required environment variable is missing. Set CLOUDINARY_URL or TEST_WITH_LOCAL_FS and try again.`
    );
  }

  // start
  console.log(`Invoked: ${config.url}`);
  console.log(config);

  const screenshotResult = await takeScreenshot(config);

  console.log(screenshotResult);
  return screenshotResult;
};
