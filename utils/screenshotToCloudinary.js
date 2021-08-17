/* eslint-disable camelcase */
const cloudinary = require('cloudinary').v2;

const takeScreenshot = require('./takeScreenshot');
const { proxyResponse, proxyError } = require('./proxy');

async function saveFileToCloudinary(base64, public_id, cloudinaryUrl) {
  // eslint-disable-next-line no-unused-vars
  const [_, api_key, api_secret, cloud_name] = cloudinaryUrl.match(
    /cloudinary:\/\/(\d+):(.+)@(.+)/
  );

  const uploadStr = `data:image/jpeg;base64,${base64}`;
  const config = {
    public_id,
    api_key,
    api_secret,
    cloud_name,
  };

  return cloudinary.uploader.upload(uploadStr, config, (err, res) => {
    if (err) throw err;
    return { url: res.secureUrl };
  });
}

async function screenshotToCloudinary(config) {
  // not checking for cache anymore 🙈
  try {
    // take the screenshot
    const image64 = await takeScreenshot(config);
    // save the screenshot
    console.log(`✍️ Writing file`);
    const saved = await saveFileToCloudinary(
      image64,
      `${config.cloudinaryFolder}/${config.fileName}`,
      config.cloudinaryUrl
    );
    // return the info
    return proxyResponse({ url: saved.url });
  } catch (error) {
    console.log('error on saving goes through proxy here');
    return proxyError(error);
  }
}

module.exports = screenshotToCloudinary;
