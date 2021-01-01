const Secret = require("../models/secrets.model.js");
const log = require("../constants/bunyan.constant");

exports.showSecret = (req, res) => {
  try {
    const user_id = req.user.user_id;
    Secret.findOne({ user_id: user_id }, (err, foundUserSecret) => {
      if (foundUserSecret !== null) {
        Secret.find({ user_id: user_id }, (err, data) => {
          if (!err) {
            log.info(`User ${user_id}'s Secrets: ${data}`);
            res.status(200).json({
              succes: true,
              message: `Secrets of user_id: ${user_id}`,
              user: data,
            });
          } else {
            log.error(`Error in showing Secrets: ${err}`);
          }
        });
      } else {
        log.error(`Secret for this user Does not Exists: ${err}`);
        res.status(400).json({
          succes: false,
          message: "Secret for this user Does not Exists",
        });
      }
    });
  } catch (error) {
    log.error(`Error in showSecret fuction: ${error}`);
  }
};

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
    Secret.findOne({ secret_id: secret_id }, (err, foundSecret) => {
      if (foundSecret !== null) {
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
              log.error(`Error in Updating Secret`);
            }
            log.info(`Successfully Update Secret: ${data}`);
            res.status(200).json({
              succes: true,
              message: `Successfully Updated Secret of secret_id: ${secret_id}`,
              user: data,
            });
          }
        );
      } else {
        log.error(`Secret Does not Exists: ${err}`);
        res.status(400).json({
          succes: false,
          message: "Secret Does not exist",
        });
      }
    });
  } catch (error) {
    log.error(`Error in editSecret Fuction: ${error}`);
  }
};

exports.deleteSecret = (req, res) => {
  try {
    const user_id = req.user.user_id;
    const secret_id = req.params.secret_id;
    Secret.findOne({ secret_id: secret_id }, (err, foundSecret) => {
      if (foundSecret !== null) {
        Secret.findOneAndDelete(
          { user_id: user_id, secret_id: secret_id },
          (err, data) => {
            if (err) {
              log.error(`Error in Deleting Secret: ${err}`);
            } else {
              log.info(`Successfully Delete Secret: ${data}`);
              res.status(200).json({
                succes: true,
                message: `Successfully Deleted Secret of secret_id: ${secret_id}`,
                user: data,
              });
            }
          }
        );
      } else {
        log.error(`Secret Does not Exists: ${err}`);
        res.status(400).json({
          succes: false,
          message: "Secret Does not exist",
        });
      }
    });
  } catch (error) {
    log.error(`Error in deleteSecret Fuction: ${error}`);
  }
};
