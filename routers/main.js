/**
 * Created by DT274 on 2017/7/25.
 */
var express = require('express');
var router = express.Router();

var Category = require("../models/category.js");

router.use('/', function(req, res) {

    Category.find().then(function (categories) {
        res.render('main/index', {
            userInfo: req.userInfo,
            categories: categories
        });
    });
});

module.exports = router;