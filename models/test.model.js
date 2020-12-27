const mongoose = require('mongoose')

const test = new mongoose.Schema({
    name: String
})

const TESTdata = mongoose.model('testDb',test);

module.exports = TESTdata;