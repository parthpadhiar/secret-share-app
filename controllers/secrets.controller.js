const Secret = require("../models/secrets.model.js");
const log = require("../constants/bunyan.constant");

exports.addSecret = (req, res) => {
  try {
    const secret = req.body.secret;
    const addSecret = new Secret({
      user_id: req.user.user_id,
      secret: secret,
    });
    addSecret.save((err, data) => {
      if (err) {
        log.error(`Error in Adding Secret: ${err}`);
        return res.status(400).json({ message: "Error in Adding Secret" });
      }
      log.info(`Secret is Successfully added: ${data}`);
      res.status(200).json({
        succes: true,
        message: `Successfully add Secret of User: ${req.user.user_id}`,
        user: data,
      });
    });
  } catch (error) {
    log.error(`Error in addSecret fuction: ${error}`);
  }
};

exports.editSecret = (req, res) => {
  try {
    const user_id = req.user.user_id;
    const secret_id = req.params.secret_id;
    const secret = req.body.secret;
    Secret.findOneAndUpdate(
      { user_id: user_id, secret_id: secret_id },
      {
        $set: {
          secret: secret,
        },
      },
      { new: true },
      (err, data) => {
        if (err) {
          log.error(`Error in Updating Secret: ${err}`);
        }
        log.info(`Successfully Update Secret: ${data}`);
        res.status(200).json({
          succes: true,
          message: `Successfully Updated Secret of secret_id: ${secret_id}`,
          user: data,
        });
      }
    );
  } catch (error) {
    log.error(`Error in editSecret Fuction: ${error}`);
  }
};
