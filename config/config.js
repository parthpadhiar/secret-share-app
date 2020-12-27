const { MONGO_URL } = require("../constants/constant.js");
const config = {
    production: {
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI
    },
    default: {
        SECRET: 'mysecretkey',
        DATABASE: MONGO_URL
    }
}


exports.get = function get(env) {
    return config[env] || config.default
}