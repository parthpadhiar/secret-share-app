const User = require("../models/user.model.js");
const log = require("../constants/bunyan.constant");

exports.welcome = (req, res) => {
  try {
    log.info("Successfully API userRoute Called");
    res.status(200).send(`Welcome to login , sign-up api`);
  } catch (error) {
    log.error(`Error in welcome fuction: ${error}`);
  }
};

exports.register = (req, res) => {
  try {
    const newUser = new User(req.body);
    if (newUser.password != newUser.password2) {
      log.error(`Password and Confirm Password does not matched`);
      return res.status(400).json({ message: "Password not match" });
    }
    User.findOne({ email: newUser.email }, (err, user) => {
      if (user) {
        log.error(`Email is Exist: ${req.user.user_id}`);
        return res.status(400).json({ auth: false, message: "Email exits" });
      }
      newUser.save((err, data) => {
        if (err) {
          log.error(`User is not registered Try Again: ${err}`);
          return res.status(400).json({ success: false });
        }
        log.info(`User is registerd: ${data}`);
        res.status(200).json({
          succes: true,
          user: data,
        });
      });
    });
  } catch (error) {
    log.error(`Error in Register Fuction: ${error}`);
  }
};

exports.login = (req, res) => {
  let token = req.cookies.auth;
  try {
    User.findByToken(token, (err, user) => {
      if (err) {
        log.error(`Error login: ${err}`);
        return res.send(err);
      }
      if (user) {
        log.error(`User is already Logged in: ${user}`);
        return res.status(400).json({
          error: true,
          message: "You are already logged in",
          token: user.token,
        });
      } else {
        User.findOne({ email: req.body.email }, function (err, user) {
          if (!user) {
            log.error(`Auth failed ,email not found: ${email}`);
            return res.json({
              isAuth: false,
              message: " Auth failed ,email not found",
            });
          }
          user.comparepassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
              log.error(`Password doesn't match: ${isMatch}`);
              return res.json({
                isAuth: false,
                message: "password doesn't match",
              });
            }
            user.generateToken((err, user) => {
              if (err) {
                log.error(`Error login genetating Token: ${err}`);
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
  } catch (error) {
    log.error(`Error in Login Fuction: ${error}`);
  }
};

exports.logout = (req, res) => {
  try {
    req.user.deleteToken(req.token, (err, user) => {
      if (err) {
        log.error(`Error in logout: ${err}`);
        return res.status(400).send(err);
      }
      log.info(`Successfully logout to User_id: ${req.user.user_id}`);
      res.status(200).json({
        succes: true,
        message: `Successfully logout User_id: ${req.user.user_id}`,
      });
    });
  } catch (error) {
    log.error(`Error in Logout Fuction: ${error}`);
  }
};

exports.profile = (req, res) => {
  res.json({
    isAuth: true,
    privacy: req.user.privacy,
    user_id: req.user.user_id,
    email: req.user.email,
    name: req.user.firstname + req.user.lastname,
  });
};

exports.editProfile = (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { firstname, lastname, privacy } = req.body;
    User.findOneAndUpdate(
      { user_id: user_id },
      {
        $set: {
          firstname: firstname,
          lastname: lastname,
          privacy: privacy,
        },
      },
      { new: true },
      (err, data) => {
        if (err) {
          log.error(`Error in Updating User Data: ${err}`);
        }
        log.info(`Successfully Update User Data: ${data}`);
        res.status(200).json({
          succes: true,
          message: `Successfully Updated User of User_id: ${req.user.user_id}`,
          user: data,
        });
      }
    );
  } catch (error) {
    log.error(`Error in Edit Profile Fuction: ${error}`);
  }
};
