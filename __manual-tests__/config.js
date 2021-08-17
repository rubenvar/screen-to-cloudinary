// this file has settings for tests only
// allowed config options:

exports.config = {
  url: process.env.SITE_URL,
  cloudinaryUrl: process.env.CLOUDINARY, // cloudinary account url
  cloudinaryFolder: 'test-screenshots',
  fileName: `screenshot-${Date.now()}`, // hardcoded variable file name
};
