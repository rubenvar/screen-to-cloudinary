require('dotenv').config();
const axios = require(`axios`);
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
