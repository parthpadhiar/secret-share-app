const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/config").get(process.env.NODE_ENV);
const salt = 10;
const log = require("../constants/bunyan.constant");

const userSchema = mongoose.Schema({
  user_id: Number,
  firstname: {
    type: String,
    required: true,
    maxlength: 100,
  },
  lastname: {
    type: String,
    required: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  password2: {
    type: String,
    required: true,
    minlength: 8,
  },
  privacy: {
    type: Boolean,
    default: true // False: Public, True : Private (Your name will not show)
  },
  token: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", function (next) {
  var user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(salt, function (err, salt) {
      if (err) {
        log.error(`User is not added =>: ${err}`);
        return next(err);
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          log.error(`User is not added user.password =>: ${err}`);
          return next(err);
        }
        log.info("User is added user.model");
        user.password = hash;
        user.password2 = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparepassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) {
      log.error(`Password is not matched =>: ${err}`);
      return cb(next);
    }
    log.info(`Password is Matched: ${isMatch}`);
    cb(null, isMatch);
  });
};

// generate token
userSchema.methods.generateToken = function (cb) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), config.SECRET);

  user.token = token;
  user.save(function (err, user) {
    if (err) {
      log.error(`Token is not generated: ${err}`);
      return cb(err);
    }
    log.info(`Token is generated for: ${user}`);
    cb(null, user);
  });
};

// find by token
userSchema.statics.findByToken = function (token, cb) {
  var user = this;
  jwt.verify(token, config.SECRET, function (err, decode) {
    user.findOne({ _id: decode, token: token }, function (err, user) {
      if (err) {
        log.error(`Token is not verify: ${err}`);
        return cb(err);
      }
      cb(null, user);
    });
  });
};

//delete token
userSchema.methods.deleteToken = function (token, cb) {
  var user = this;
  user.update({ $unset: { token: 1 } }, function (err, user) {
    if (err) {
      log.error(`Token is not deleted =>: ${err}`);
      return cb(err);
    }
    cb(null, user);
  });
};

autoIncrement.initialize(mongoose.connection);
userSchema.plugin(autoIncrement.plugin, {
  model: "User",
  field: "user_id",
  incrementBy: 1,
});

module.exports = mongoose.model("User", userSchema);
