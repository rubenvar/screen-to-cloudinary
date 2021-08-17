// this file has settings for tests only

exports.config = {
  url: process.env.SITE_URL, // url to take screenshot of
  cloudinaryUrl: process.env.CLOUDINARY, // full cloudinary account url
  cloudinaryFolder: 'test-screenshots',
  fileName: `screenshot-${Date.now()}`, // hardcoded variable file name
};
