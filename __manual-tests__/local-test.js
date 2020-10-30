const mainProcess = require(`../index`);

const start = async () => {
  const event = {
    body: JSON.stringify({
      // config options
      url: 'https://www.le-vpn.com/es/',
      // url: process.env.SITE_URL,
      cloudinaryFolder: 'vpnf/screenshots',
      fileName: 'F013',
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
