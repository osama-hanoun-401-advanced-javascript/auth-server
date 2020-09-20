'use strict';

const mongoose = require('mongoose');

const user = mongoose.Schema({
  username: {type: String, required: true,unique: true},
  email: {type: String, required: true ,unique: true},
  password: {type: String, required: true},
  fullname: {type: String, required: true},

});

module.exports = mongoose.model('user', user);