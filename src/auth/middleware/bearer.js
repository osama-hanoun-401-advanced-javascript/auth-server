'use strict';

const users = require('../models/users/users-collection');
// what is this middleware used for?
// check on the token, does it exist?
// if yes then parse it and get user and validate him

// check if I have in my request header, an Authorization key
// header key Authorization 
// value of it {Bearer token}
module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return next('Invalid Login, No Headers !!');
  }
  console.log('req.headers.authorization : ', req.headers.authorization);
  let bearer = req.headers.authorization.split(' ');
  console.log('bearer[0]>>>>>', bearer[0]);
  if (bearer[0] == 'Bearer') {

    const token = bearer[1];
    console.log('token[0]>>>>>', token);

    // authenticate this token and get the valid user
    users.authenticateToken(token).then(validUser => {
      console.log('validUser ---> ', validUser);
      req.user = validUser;
      next();
    }).catch(err => next('Invalid Token!'));

  } else {
    return next('Invalid Bearer!!');
  }





};