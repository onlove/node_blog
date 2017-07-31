var mongoose = require('mongoose');
var categorySchema = require("../schemas/category.js");

//用户模型类
module.exports = mongoose.model('Category', categorySchema);