const proxyResponse = body => {
  body.success = true;

  return {
    statusCode: 200,
    body: JSON.stringify(body),
  };
};

const proxyError = err => {
  let msg = err;

  if (err instanceof Error) {
    msg = err.message;
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      success: false,
      error: msg,
    }),
  };
};

exports.proxyResponse = proxyResponse;
exports.proxyError = proxyError;
