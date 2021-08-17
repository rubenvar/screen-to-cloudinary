const mainProcess = require('../index');
const { config } = require('./config');

const start = async () => {
  const event = {
    body: JSON.stringify(config),
  };

  const result = await mainProcess.handler(event);

  return result;
};

start();
