'use strict';

const mongoose = require('mongoose');
const { update } = require('./users-collection');

const user = mongoose.Schema({
  username: {type: String, required: true,unique: true},
  email: {type: String, required: true ,unique: true},
  password: {type: String , required: true},
  fullname: {type: String, required: true},
  roles: { type: Array,enum: ['read', 'create','delete','update']},
});

module.exports = mongoose.model('user', user);
