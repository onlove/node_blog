var mongoose = require('mongoose');
var contentsSchema = require("../schemas/contents.js");

//内容模型类
module.exports = mongoose.model('Contents', contentsSchema);