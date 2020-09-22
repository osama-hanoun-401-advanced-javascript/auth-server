'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const schema = require('./users-schema');
const SECRET = 'mytokensecret';
const MongoModel = require('../mongo-model');

class User extends MongoModel {
  validUser(record) {
    let userNameObj = { username: record.username };

    return this.get(userNameObj)
      .then(async (dBResult) => {
        let valid = dBResult[0].email.includes('@github.com') ? true : await bcrypt.compare(record.password, dBResult[0].password);
        if (!valid) {
          return Promise.reject('Wrong Password');
        }
        let token = jwt.sign({ data: record.username }, SECRET);
        return {
          'token': token, 'user': {
            'acl': [],
            'username': record.username,
          },
        };
      }).catch(err => {
        err = typeof err === 'object' ? 'Invalid Login' : err;
        console.log('err>>>>>>', typeof err);
        return Promise.reject({ error: err });
      });
  }
  async authenticateToken(token) {
    try {
      let tokenObject =  jwt.verify(token, SECRET);
      let user = await this.get({username : tokenObject.data});
      console.log('user?>>>>>>>>',user);
      if (user ) {
        return Promise.resolve({
          tokenObject: tokenObject,
          user,
        });
      } else {
        return Promise.reject();
      }
    } catch (e) {
      return Promise.reject();
    }

  }
}

module.exports = new User(schema);