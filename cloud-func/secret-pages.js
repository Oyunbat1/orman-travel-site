exports.handler = function (event, context, callback) {
  const secretContent = `
<h3> Welcome to our acc.Залуу минь азтай байна шүү чи бас!! </h3>
<p> Зөвхөн чамд зориулав </p>
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
