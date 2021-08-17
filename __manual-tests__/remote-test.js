require('dotenv').config();

// eslint-disable-next-line import/no-extraneous-dependencies
const axios = require('axios'); // axios is nly used in dev, for testing locally
const { config } = require('./config');

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
