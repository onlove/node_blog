var mongoose = require('mongoose');
var userSchema = require("../schemas/users.js");

//用户模型类
module.exports = mongoose.model('User', userSchema);