require('dotenv').config();

const axios = require(`axios`);

const event = {
  // body: {
  // config options
  url: process.env.SITE_URL,
  cloudinaryFolder: 'vpnf/screenshots',
  fileName: 'F009',
  // },
};

const start = async () => {
  let screenshotResponse;
  try {
    screenshotResponse = await axios.post(process.env.LAMBDA_ENDPOINT, event);
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
