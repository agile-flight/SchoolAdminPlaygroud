const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

module.exports = {
  express,
  bodyParser,
  helmet,
  morgan,
  cors,
};

// const { express, bodyParser, helmet, morgan, cors} = require('./middlewares');