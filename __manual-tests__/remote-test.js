require('dotenv').config();

const axios = require(`axios`);

// config options
const config = {
  url: process.env.SITE_URL,
  cloudinaryFolder: 'vpnf/screenshots',
  fileName: 'F007',
};

const start = async () => {
  let screenshotResponse;
  try {
    screenshotResponse = await axios.post(process.env.LAMBDA_ENDPOINT, config);
    const { status, data } = screenshotResponse;
    console.log(status);
    console.log(data);
  } catch (error) {
    console.log('⚠️ 🐛 ⚠️ 🐛 ⚠️ 🐛 There was an error ↓');
    console.log(error);
    console.log({ screenshotResponse });
    console.log('⚠️ 🐛 ⚠️ 🐛 ⚠️ 🐛 There was an error ↑');
  }
};

start();

// {
//   "url": "https://hide.me/es/",
//   "cloudinaryFolder": "vpnf/screenshots",
//   "fileName": "F009"
// }
