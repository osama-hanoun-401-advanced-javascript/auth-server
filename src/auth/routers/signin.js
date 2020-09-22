'use strict';

const express = require('express');
const router = express.Router();
const basicAuth = require('../middleware/basic');
router.use(express.json());
router.post('/signin', basicAuth, handleSignin);

async function handleSignin(req, res) {
  // add the token as cookie 
  res.cookie('token', req.userSession.token);
  // add a header
  res.set('token', req.userSession.token);
  // send json object with token and user record
  res.status(200).json(req.userSession);
}	

module.exports = router;
