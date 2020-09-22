'use strict';
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();


const user = require('../models/users/users-collection');

router.post('/signup', handleSignup);

async function handleSignup(req, res) {

  checkInput(req)?null:res.status(500).send('Invalid Input');
  req.body.password = await bcrypt.hash(req.body.password, 5);
  user.create(req.body).then(result => {
    res.json(result);
  }).catch(err => {
    res.status(500).send('You already have an account');
  });
}
function checkInput(req) {
  if (!(req.body.password && req.body.username && req.body.fullname && req.body.email)) {
    return false;
  } else{
    return true;
  }
}
module.exports = router;
