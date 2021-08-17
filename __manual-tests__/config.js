// edit this file to change the test settings
// allowed config options:

// - cloudinaryFolder
// - fileName
// - url
// - width
// - height
// - fullPage

exports.config = {
  // TODO: allow to choose folder in cloudinary
  // cloudinaryFolder: 'vpnf/screenshots',
  cloudinaryFolder: 'test-screenshots',
  // hardcoded variable file name
  // TODO: allow to choose filename prefix, and auto-add timestamp to avoid duplicates
  fileName: `screenshot-${Date.now()}`,
  url: process.env.SITE_URL,
};
