const TESTdata = require("../models/test.model.js");
const log = require('../constants/bunyan.constant')

exports.test = (req, res) => {
    try {
        const data = new TESTdata({
            name: "Hello world",
          });
          res.send("Hello");
          return data.save();
    } catch (error) {
        log.error(`Error in test fuction: ${error}`);   
    }
}
