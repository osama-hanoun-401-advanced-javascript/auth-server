'use strict';

const superagent = require('superagent');
const users = require('../models/users/users-collection');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = 'mytokensecret';

/*
  Resources
  https://developer.github.com/apps/building-oauth-apps/
*/

const tokenServerUrl = process.env.TOKEN_SERVER;
const remoteAPI = process.env.REMOTE_API;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const API_SERVER = process.env.API_SERVER;

module.exports = async function authorize(req, res, next) {

  try {
    let code = req.query.code;
    console.log('(1) CODE:', code);

    let remoteToken = await exchangeCodeForToken(code);
    console.log('(2) ACCESS TOKEN:', remoteToken);

    let remoteUserName = await getRemoteUserInfo(remoteToken);
    console.log('(3) GITHUB USER', remoteUserName.login.toLowerCase());
    let userDB = await checkUser(remoteUserName.login.toLowerCase());
    req.user = userDB;
    next();
  } catch (e) { next(`ERROR: ${e.message}`); }

};

async function exchangeCodeForToken(code) {

  let tokenResponse = await superagent.post(tokenServerUrl).send({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: API_SERVER,
    grant_type: 'authorization_code',
  });
  let access_token = tokenResponse.body.access_token;

  return access_token;

}

async function getRemoteUserInfo(token) {

  let userResponse =
    await superagent.get(remoteAPI)
      .set('user-agent', 'express-app')
      .set('Authorization', `token ${token}`);

  let user = userResponse.body;

  return user;

}

async function checkUser(username) {
  try {
    let validUser = await users.validUser({ username });
    return validUser;
  } catch (e) {
    let password = await bcrypt.hash(username, 5);
    let user = await users.create({ username, fullname: username, password, email: username + '@github.com' });
    let token = jwt.sign({ data: user.username },SECRET);
    return {
      'token': token, 'user': {
        'acl': [],
        'username': user.username,
      },
    };

  }
} 