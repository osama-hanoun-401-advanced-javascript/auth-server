'use strict';
const express = require('express');
// const cors = require('cors');
const morgan = require('morgan');
const signinRouter = require('./auth/routers/signin');
const signupRouter = require('./auth/routers/signup');
const usersRouter = require('./auth/routers/users');
const oauth = require('./auth/middleware/oauth');
const bearerAuth = require('./extra-routes');


const app = express();
app.use(express.static('./public'));
app.use(morgan('dev'));
app.use(express.json());
app.use(signinRouter);
app.use(signupRouter);
app.use(usersRouter);
app.use(bearerAuth);

// Routes
app.get('/oauth', oauth, (req, res) => {
  res.json(req.user);
});


module.exports = {
  server: app,
  start: port => {
    let PORT = port || process.env.PORT || 3000;
    app.listen(PORT, ()=> {
      console.log(`Listening on port ${PORT}`);
    });
  },
};