const mainProcess = require('../index');
const { config } = require('./config');

const start = async () => {
  const event = {
    body: JSON.stringify(config),
  };

  // const context = {
  //   fail: err => {
  //     console.log(`error:`);
  //     console.log(err);
  //   },
  //   succeed: res => {
  //     console.log(`success!`);
  //     console.log(res);
  //   },
  // };

  // const result = await mainProcess.handler(event, context);
  const result = await mainProcess.handler(event);

  return result;
};

start();
