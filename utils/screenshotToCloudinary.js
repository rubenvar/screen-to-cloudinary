const cloudinary = require('cloudinary').v2;

const takeScreenshot = require('./takeScreenshot');
const { proxyResponse, proxyError } = require('./proxy');

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
    const image64 = await takeScreenshot(config);
    // save the screenshot
    console.log(`✍️ Writing file`);
    const saved = await saveFileToCloudinary(
      image64,
      config.cloudinaryFolder,
      config.fileName
    );
    return proxyResponse({ url: saved.url });
  } catch (error) {
    console.log('error goes through here');
    return proxyError(error);
  }
  // finally {
  //   if (browser !== null) {
  //     await browser.close();
  //   }
  // }
}

module.exports = screenshotToCloudinary;
