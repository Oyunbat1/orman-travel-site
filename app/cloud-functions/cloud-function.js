exports.handler = function (event, context, callback) {
  callback(null, {
    statusCode: 200,
    body: "welcome to our page , it is only your web browser.",
  });
};
