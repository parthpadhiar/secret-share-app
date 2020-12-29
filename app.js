const express = require('express');
const bodyParser =  require("body-parser");
const mongoose = require('mongoose');
const db = require('./config/config').get(process.env.NODE_ENV);
const { PORT } = require("./constants/constant.js");
const log = require('./constants/bunyan.constant')
const userRoutes = require('./routes/user.route.js');
const secretRoutes = require('./routes/secrets.route.js');

const cookieParser = require('cookie-parser');

mongoose.connect(db.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const app = express();
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

/**
 * Routes
 */
app.use(userRoutes);
app.use(secretRoutes);

app.listen(PORT, () => {
  log.info(`Successfully connected to Port: ${PORT}`);
});
