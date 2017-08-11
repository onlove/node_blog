/**
 * Created by DT274 on 2017/7/25.
 */
var express = require('express');
var router = express.Router();

var Category = require("../models/category.js");
var Contents = require("../models/contents.js");

var data;

/*
* 处理通用数据
* */
router.use(function(req, res, next) {
    data = {
        userInfo: req.userInfo,
        categories: []
    };

    Category.find().then(function (categories) {
        data.categories = categories;
        next();
    });
});


/*
 首页
* */
router.get('/', function(req, res) {
    data.category = req.query.category || '';
    data.page = Number(req.query.page) || 1;
    data.limit = 4;
    data.pages = 0;
    data.count = 0;

    var where = {};
    if (data.category) {
        where.category = data.category;
    }

    //获取所有的分类
    Contents.where(where).count().then(function (count) {
        data.count = count;
        data.pages = Math.ceil(data.count / data.limit);
        data.page = Math.min(data.page, data.pages);
        data.page = Math.max(data.page, 1);
        var skip = (data.page - 1) * data.limit;

        return Contents.where(where).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({
            addTime: -1
        })
    }).then(function (contents) {
        data.contents = contents;
        res.render('main/index', data);
    })
});


router.get('/view', function(req, res) {
    var contentId = req.query.contentid || '';
    Contents.findOne({
        _id: contentId
    }).then(function(content){
        data.content = content;
        content.views++;
        content.save();
        res.render('main/view', data);
    })
});

module.exports = router;