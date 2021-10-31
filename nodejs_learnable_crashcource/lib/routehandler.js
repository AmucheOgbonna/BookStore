const fileUtil = require('./fileUtil');
const helper = require('./helper');
const fs = require('fs');
const path = require('path');

const routeHandler = {};

routeHandler.Books = (data, callback) => {
  const acceptableHeaders = ['post', 'get', 'put', 'delete'];
  if (acceptableHeaders.indexOf(data.method) > -1) {
    routeHandler._books[data.method](data, callback);
  } else {
    callback(405);
  }
};

routeHandler.Copies = (data, callback) => {
  const acceptableHeaders = ['post', 'get', 'put', 'delete'];
  if (acceptableHeaders.indexOf(data.method) > -1) {
    routeHandler._copies[data.method](data, callback);
  } else {
    callback(405);
  }
};

routeHandler.Login = (data, callback) => {
  const acceptableHeaders = ['post', 'get', 'put', 'delete'];
  if (acceptableHeaders.indexOf(data.method) > -1) {
    routeHandler._user[data.method](data, callback);
  } else {
    callback(405);
  }
};

routeHandler.requestBook = (data, callback) => {
  const acceptableHeaders = ['post', 'get', 'put', 'delete'];
  if (acceptableHeaders.indexOf(data.method) > -1) {
    routeHandler._requestBook[data.method](data, callback);
  } else {
    callback(405);
  }
};
routeHandler.registerUser = (data, callback) => {
  const acceptableHeaders = ['post', 'get', 'put', 'delete'];
  if (acceptableHeaders.indexOf(data.method) > -1) {
    routeHandler._registerUser[data.method](data, callback);
  } else {
    callback(405);
  }
};

//main book route object
routeHandler._books = {};

//Post route -- for creating a book
routeHandler._books.post = (data, callback) => {
  //validate that all required fields are filled out
  let name =
    typeof data.payload.name === 'string' && data.payload.name.trim().length > 0
      ? data.payload.name
      : false;
  let price =
    typeof data.payload.price === 'string' &&
    !isNaN(parseInt(data.payload.price))
      ? data.payload.price
      : false;
  let author =
    typeof data.payload.author === 'string' &&
    data.payload.author.trim().length > 0
      ? data.payload.author
      : false;
  let publisher =
    typeof data.payload.publisher === 'string' &&
    data.payload.publisher.trim().length > 0
      ? data.payload.publisher
      : false;

  if (name && price && author && publisher) {
    const fileName = helper.generateRandomString(30);
    fileUtil.create('books', fileName, data.payload, (err) => {
      if (!err) {
        callback(200, { message: 'book added successfully', data: null });
      } else {
        callback(400, { message: 'could add book' });
      }
    });
  } else {
    callback(400, { message: 'Some fiedls are incorrect' });
  }
};

//Get route -- for geting a book
routeHandler._books.get = (data, callback) => {
  console.log(data);
  if (data.query.name) {
    fileUtil.read('books', data.query.name, (err, data) => {
      if (!err && data) {
        callback(200, { message: 'book retrieved', data: data });
      } else {
        callback(404, {
          err: err,
          data: data,
          message: 'could not retrieve book',
        });
      }
    });
  } else {
    callback(404, { message: 'book not found', data: null });
  }
};

//Put route -- for updating a book
routeHandler._books.put = (data, callback) => {
  if (data.query.name) {
    fileUtil.update('books', data.query.name, data.payload, (err) => {
      if (!err) {
        callback(200, { message: 'book updated successfully' });
      } else {
        callback(400, {
          err: err,
          data: null,
          message: 'could not update book',
        });
      }
    });
  } else {
    callback(404, { message: 'book not found' });
  }
};

//Delete route -- for deleting a book
routeHandler._books.delete = (data, callback) => {
  if (data.query.name) {
    fileUtil.delete('books', data.query.name, (err) => {
      if (!err) {
        callback(200, { message: 'book deleted successfully' });
      } else {
        callback(400, { err: err, message: 'could not delete book' });
      }
    });
  } else {
    callback(404, { message: 'book not found' });
  }
};

//Get route -- for geting a book
routeHandler._books.get = (data, callback) => {
  console.log(data);
  if (data.query.name) {
    fileUtil.read('books', data.query.name, (err, data) => {
      if (!err && data) {
        callback(200, { message: 'book retrieved', data: data });
      } else {
        callback(404, {
          err: err,
          data: data,
          message: 'could not retrieve book',
        });
      }
    });
  } else {
    callback(404, { message: 'book not found', data: null });
  }
};

/**
 *
 * COPIES
 */
//main book route object
routeHandler._copies = {};
//Post route --
routeHandler._copies.post = (data, callback) => {
  //validate that all required fields are filled out
  console.log(data.payload);
  let bookId =
    typeof data.payload.bookId === 'string' &&
    data.payload.bookId.trim().length > 0
      ? data.payload.bookId
      : false;

  let number =
    typeof data.payload.number === 'string' &&
    data.payload.number.trim().length > 0
      ? data.payload.number
      : false;

  fileUtil.read('books', bookId, (err, data) => {
    if (!err && data) {
      if (number && bookId) {
        const fileName = helper.generateRandomString(30);
        fileUtil.create('copies', fileName, { number, bookId }, (err) => {
          if (!err) {
            return callback(200, {
              message: 'copy added successfully',
              data: null,
            });
          } else {
            return callback(400, { message: 'could not add copy' });
          }
        });
      } else {
        return callback(400, { message: 'Some fields are incorrect' });
      }
    } else {
      callback(404, {
        err: err,
        data: data,
        message: 'could not retrieve book',
      });
    }
  });
};

routeHandler._copies.get = (data, callback) => {
  if (data.query.bookId) {
    fileUtil.read('copies', data.query.bookId, (err, data) => {
      if (!err && data) {
        callback(200, { message: 'book retrieved', data: data });
      } else {
        callback(404, {
          err: err,
          data: data,
          message: 'could not retrieve book',
        });
      }
    });
  } else {
    callback(404, { message: 'book not found', data: null });
  }
};

//Post route -- for creating a book

routeHandler._registerUser = {};
routeHandler._registerUser.post = (data, callback) => {
  let name =
    typeof data.payload.name === 'string' && data.payload.name.trim().length > 0
      ? data.payload.name
      : false;

  let email =
    typeof data.payload.email === 'string' &&
    data.payload.email.trim().length > 0
      ? data.payload.email
      : false;

  let password =
    typeof data.payload.password === 'string' &&
    data.payload.password.trim().length > 0
      ? data.payload.password
      : false;

  if (name && email && password) {
    const fileName = helper.generateRandomString(30);
    let min = Math.ceil(0);
    let max = Math.floor(100);
    let id = Math.floor(Math.random() * (max - min + 1)) + min; // max & min both included.
    fileUtil.create('users', fileName, { id, ...data.payload }, (err) => {
      if (!err) {
        return callback(200, {
          message: 'user added successfully',
          data: null,
        });
      } else {
        return callback(400, { message: 'could not add user' });
      }
    });
  } else {
    return callback(400, { message: 'Some fields are incorrect' });
  }
};

routeHandler.requestBook = {};
routeHandler.requestBook.post = (data, callback) => {
  let email =
    typeof data.payload.email === 'string' &&
    data.payload.email.trim().length > 0
      ? data.payload.email
      : false;

  let bookId =
    typeof data.payload.bookName === 'string' &&
    data.payload.bookName.trim().length > 0
      ? data.payload.bookName
      : false;

  fileUtil.read('books', bookId, (err, data) => {
    if (!err && data) {
      console.log(data);
      // if (number && bookId) {
      //   const fileName = helper.generateRandomString(30);
      //   console.log(data);
      // } else {
      //   return callback(400, { message: 'Some fields are incorrect' });
      // }
    } else {
      callback(404, {
        err: err,
        data: data,
        message: 'could not retrieve book',
      });
    }
  });
};

routeHandler.ping = (data, callback) => {
  callback(200, { response: 'server is live' });
};

routeHandler.notfound = (data, callback) => {
  callback(404, { response: 'not found' });
};

module.exports = routeHandler;
