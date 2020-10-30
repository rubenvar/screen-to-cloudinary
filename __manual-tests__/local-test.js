const mainProcess = require(`../index`);

const start = async () => {
  const event = {
    body: JSON.stringify({
      // config options
      url: process.env.SITE_URL,
    }),
  };

  const context = {
    fail: err => {
      console.log(`error:`);
      console.log(err);
    },
    succeed: res => {
      console.log(`success!`);
      console.log(res);
    },
  };

  const result = await mainProcess.handler(event, context);

  return result;
};

start();
