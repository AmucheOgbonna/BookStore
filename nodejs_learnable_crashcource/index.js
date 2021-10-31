/**
 * Entry file to out application
 */

const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routeHandler = require('./lib/routehandler');

const httpServer = http.createServer((req, res) => {
  //parse the incoming url
  const parsedurl = url.parse(req.url, true);
  //get the path name
  const pathname = parsedurl.pathname;
  const trimedPath = pathname.replace(/^\/+|\/+$/g, '');
  //create route name
  const routeName = trimedPath.split('/')[1];
  //get the Http Method
  const method = req.method.toLowerCase();
  //get the query string
  const queryStringObj = parsedurl.query;
  //get the request headers
  const headers = req.headers;

  //get the requests parameter

  const decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();

    const parsedPayload = buffer !== '' ? JSON.parse(buffer) : {};
    console.log(parsedPayload);
    const data = {
      trimedPath: trimedPath,
      query: queryStringObj,
      method: method,
      headers: headers,
      payload: parsedPayload,
      // param:
    };
    const chosenHandler =
      typeof router[trimedPath] !== 'undefined'
        ? router[trimedPath]
        : router.notfound;

    //use the chosen handler to handle the request
    chosenHandler(data, (statusCode, result) => {
      statusCode = typeof statusCode === 'number' ? statusCode : 200;
      result = typeof res === 'object' ? result : {};

      const responseObj = JSON.stringify(result);

      res.setHeader('Content-type', 'application/json');
      res.writeHead(statusCode);

      res.write(responseObj);
      res.end();

      console.log(
        `the url visited was, ${trimedPath} and the method is ${method}`
      );
    });
  });
});

const router = {
  ping: routeHandler.ping,
  books: routeHandler.Books,
  copies: routeHandler.Copies,
  registerUser: routeHandler.registerUser,
  requestBook: routeHandler.requestBook,

  notfound: routeHandler.notfound,
};

//start listening on port 8080
const PORT = 3001 || process.env.PORT;
httpServer.listen(PORT, () => {
  console.log(`server is listening on http://localhost:${PORT}`);
});
