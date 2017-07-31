/**
 * Created by DT274 on 2017/7/25.
 */
var express = require('express');
var router = express.Router();

var User = require("../models/user.js");
var Category = require("../models/category.js");

router.use(function(req, res, next) {
   if (!req.userInfo.isAdmin) {
      res.send('对不起，只有管理员才可进入该页面');
      return;
   }
   next();
});

//首页
router.get('/', function(req, res, next) {
   res.render('admin/index', {
      userInfo: req.userInfo
   })
});

//
router.get('/user', function(req, res) {
   /*
   * 从数据库读取所有用户数据
   *
   * limit(Number):限制获取的数据条数
   * skip() 忽略数据的条数
   *
   * 每页显示两条
   * 1: 1-2  skip 0  (当前页-1) * limit
   * 2: 3-4  skip 2
   * */

   var page = Number(req.query.page) || 1;
   var limit = 4;
   var pages = 0;

   User.count().then(function(count) {

      pages = Math.ceil(count / limit);
      page = Math.min(page, pages);
      page = Math.max(page, 1);
      var skip = (page - 1) * limit;

      User.find().limit(limit).skip(skip).then(function(users) {
         res.render('admin/user_index', {
            userInfo: req.userInfo,
            users: users,

            pages: pages,
            count: count,
            limit: limit,
            page: page

         })
      });
   });
});

/* 分类首页 */
router.get('/category', function(req, res) {
   res.render('admin/category_index', {
      userInfo: req.userInfo
   })
});

/* 添加分类 */
router.get('/category/add', function(req, res) {
   res.render('admin/category_add', {
      userInfo: req.userInfo
   })
});


/* 分类分类 */
router.post('/category/add', function(req, res) {
   var name = req.body.name || '';
   if (name == '') {
      res.render('admin/error', {
         userInfo: req.userInfo,
         message: '名称不能为空'
      })
   }
});
module.exports = router;