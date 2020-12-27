const User = require("../models/user.model.js");
const log = require("../constants/bunyan.constant");

exports.welcome = (req, res) => {
  try {
    log.info("Successfully API userRoute Called");
    res.status(200).send(`Welcome to login , sign-up api`);
  } catch (error) {
    log.error(`Error in welcome fuction ${error}`);
  }
};

exports.register = (req, res) => {
  const newUser = new User(req.body);
  if (newUser.password != newUser.password2) {
    log.error(`Password and Confirm Password does not matched`);
    return res.status(400).json({ message: "Password not match" });
  }
  User.findOne({ email: newUser.email }, (err, user) => {
    if (user) {
      log.error(`Email is Exist ${user}`);
      return res.status(400).json({ auth: false, message: "Email exits" });
    }
    newUser.save((err, doc) => {
      if (err) {
        log.error(`User is not registered Try Again ${err}`);
        return res.status(400).json({ success: false });
      }
      log.info(`User is registerd ${doc}`);
      res.status(200).json({
        succes: true,
        user: doc,
      });
    });
  });
};

exports.login = (req, res) => {
  let token = req.cookies.auth;
  User.findByToken(token, (err, user) => {
    if (err) {
      log.error(`Error login ${err}`);
      return res.send(err);
    }
    if (user) {
      log.error(`User is already Logged in ${user}`);
      return res.status(400).json({
        error: true,
        message: "You are already logged in",
        token: user.token,
      });
    } else {
      User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
          log.error(`Auth failed ,email not found ${email}`);
          return res.json({
            isAuth: false,
            message: " Auth failed ,email not found",
          });
        }
        user.comparepassword(req.body.password, (err, isMatch) => {
          if (!isMatch) {
            log.error(`Password doesn't match ${isMatch}`);
            return res.json({
              isAuth: false,
              message: "password doesn't match",
            });
          }
          user.generateToken((err, user) => {
            if (err) {
              log.error(`Error login genetating Token ${err}`);
              return res.status(400).send(err);
            }
            res.cookie("auth", user.token).json({
              isAuth: true,
              id: user._id,
              email: user.email,
              token: user.token,
            });
          });
        });
      });
    }
  });
};

exports.profile = (req, res) => {
  res.json({
    isAuth: true,
    id: req.user._id,
    user_id: req.user.user_id,
    email: req.user.email,
    name: req.user.firstname + req.user.lastname,
  });
};

exports.logout = (req, res) => {
  req.user.deleteToken(req.token, (err, user) => {
    if (err) {
      log.error(`Error in logout ${err}`);
      return res.status(400).send(err);
    }
    log.error(`Successfully logout ${user}`);
    res.sendStatus(200);
  });
};
