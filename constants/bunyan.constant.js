const bunyan = require("bunyan");

const log = bunyan.createLogger({ name: "Secret-Share" });
module.exports = log;