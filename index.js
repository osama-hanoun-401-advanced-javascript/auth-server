// run the server and connect to DB

const mongoose = require('mongoose');
const server = require('./src/server');

// connection details should be .env file
const MONGOOSE_URL = 'mongodb://localhost:27017/auth-server';

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

mongoose.connect(MONGOOSE_URL, mongooseOptions).then(()=>{
  server.start(3000);
}).catch((err)=>console.error('unable to connect to MangoDB',err));

