exports.config = {
  // config options
  url: process.env.SITE_URL,
  // TODO: allow to choose folder in cloudinary
  cloudinaryFolder: 'vpnf/screenshots',
  // hardcoded variable file name
  // TODO: allow to choose filename prefix, and auto-add timestamp to avoid duplicates
  fileName: `screenshot-${Date.now()}`, 
};
