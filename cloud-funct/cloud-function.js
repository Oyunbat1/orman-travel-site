exports.handler = function (event, context, callback) {
  const secretContent = `
    <h3> This is privite web page welcome <h3>
    <p>Youre so  <strong> lucky </strong> guy</p>
`;
  let body;

  if (event.body) {
    body = JSON.parse(event.body);
  } else {
    body = {};
  }
  if (body.password == "JavaScript") {
    callback(null, {
      statusCode: 200,
      body: secretContent,
    });
  } else {
    callback(null, {
      statusCode: 401,
    });
  }
};
