/**
 * Created by DT274 on 2017/7/25.
 */
var express = require('express');
var router = express.Router();

var User = require("../models/user.js");
var Category = require("../models/category.js");
var Contents = require("../models/contents.js");

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
            page: page,
            url: '/admin/user'
         })
      });
   });
});

/* 分类首页 */
router.get('/category', function(req, res) {
   var page = Number(req.query.page) || 1;
   var limit = 4;
   var pages = 0;

   Category.count().then(function(count) {
      pages = Math.ceil(count / limit);
      page = Math.min(page, pages);
      page = Math.max(page, 1);
      var skip = (page - 1) * limit;
      /*
      * 升序 从小到大
      * 降序 从大到小
      * */

      Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function(categories) {
         res.render('admin/category_index', {
            userInfo: req.userInfo,
            categories: categories,

            pages: pages,
            count: count,
            limit: limit,
            page: page,
            url: '/admin/category'
         })
      });
   });
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
      return;
   }

   Category.findOne({
      name: name
   }).then(function(rs) {
      if (rs) {
         res.render('/admin/error', {
            userInfo: req.userInfo,
            message: "分类信息存在"
         });
         return Promise.reject();
      } else {
         //数据库中不存在
         return new Category({
            name: name
         }).save();
      }
   }).then(function(newCategory) {
      res.render('admin/success', {
         userInfo: req.userInfo,
         message: "分类保存成功",
         url: '/admin/category'
      })
   })
});

//分类修改
router.get('/category/edit', function(req, res) {
   //获取要修改的分类信息，且表单形式展示
   var id = req.query.id || '';
   Category.findOne({
      _id: id
   }).then(function(category) {
      if (!category) {
         res.render("admin/error", {
            message: "分类信息不存在"
         });
      }else {
         res.render("admin/category_edit", {
            category: category
         });
      }

   })
});
//保存分类修改
router.post('/category/edit', function (req, res) {
   var id = req.query.id || '';
   var name = req.body.name || '';

   Category.findOne({
      _id: id
   }).then(function(category) {
      if (!category) {
         res.render("admin/error", {
            message: "分类信息不存在"
         });
      }else {
         //当用户没有做任何的修改提交的时候
         if (name === category.name) {
            res.render('admin/success', {
               message: "修改成功",
               url: '/admin/category'
            });
            return Promise.reject();
         } else {
            //要修改的分类名称是否已经在数据库存在
            return Category.findOne({
               _id: {$ne: id},
               name: name
            });
         }
      }
   }).then(function(sameCategory) {
      if (sameCategory) {
         res.render('admin/error', {
            message: "数据库中已经存在同名分类"
         });
         return Promise.reject();
      } else {
         return Category.update({
            _id: id
         }, {
            name: name
         })
      }
   }).then(function() {
      res.render('admin/success', {
         message: "修改成功",
         url: '/admin/category'
      });
   })
});

//分类删除
router.get('/category/delete', function(req, res) {
   //获取要删除的分类id
   var id = req.query.id || '';
   Category.remove({
      _id: id
   }).then(function() {
      res.render('admin/success', {
         message: "删除成功",
         url: '/admin/category'
      });
   })
});

/*
* 内容首页
* */
router.get('/content', function(req, res) {
   var page = Number(req.query.page) || 1;
   var limit = 4;
   var pages = 0;

   Contents.count().then(function(count) {
      pages = Math.ceil(count / limit);
      page = Math.min(page, pages);
      page = Math.max(page, 1);
      var skip = (page - 1) * limit;
      /*
       * 升序 从小到大
       * 降序 从大到小
       * */

      Contents.find().limit(limit).skip(skip).populate(['category', 'user']).sort({addTime: -1}).then(function(contents) {
         res.render('admin/content_index', {
            userInfo: req.userInfo,
            contents: contents,

            pages: pages,
            count: count,
            limit: limit,
            page: page,
            url: '/admin/content'
         })
      });
   });
});


/*
* 内容添加
* */
router.get('/content/add', function(req, res) {
   Category.find().sort({_id: -1}).then(function(categories) {
      res.render('admin/content_add', {
         user: req.userInfo,
         categories: categories
      });
   });
});

/*
* 内容保存
* */
router.post('/content/add', function(req, res) {
   if (req.body.category == '') {
      res.render('admin/error', {
         message: '内容分类不能为空'
      });
      return;
   }

   if (req.body.title == '') {
      res.render('admin/error', {
         message: '内容分类标题不能为空'
      });
      return;
   }

   new Contents({
      category: req.body.category,
      title: req.body.title,
      user: req.userInfo._id.toString(),
      description: req.body.description,
      content: req.body.content
   }).save().then(function(rs) {
      res.render('admin/success', {
         message: '内容保存成功',
         url: '/admin/content'
      });
   })
});

/*
* 修改内容
* */
router.get('/content/edit', function(req, res) {
   var id = req.query.id || '';
   var categories = [];

   Category.find().sort({_id: -1}).then(function(data) {
      categories = data;
      return Contents.findOne({
         _id: id
      }).populate('category')
   }).then(function(content) {
      if (!content) {
         res.render('admin/error', {
            message: '指定的内容不存在'
         });
         return Promise.reject();
      } else {
         res.render('admin/content_edit', {
            content: content,
            categories: categories
         });
      }
   })
});
/**
 *
 * 内容保存
 */
router.post('/content/edit', function(req, res) {
   var id = req.query.id || '';
   if (req.body.category == '') {
      res.render('admin/error', {
         message: '内容分类不能为空'
      });
      return;
   }

   if (req.body.title == '') {
      res.render('admin/error', {
         message: '内容分类标题不能为空'
      });
      return;
   }

   Contents.update({
      _id: id
   }, {
      category: req.body.category,
      title: req.body.title,
      description: req.body.description,
      content: req.body.content
   }).then(function() {
      res.render('admin/success', {
         message: '内容保存成功',
         url: '/admin/content/edit?id=' + id
      });
   })
});


/**
 *
 * 内容删除
 */
router.get('/content/delete', function(req, res) {
   var id = req.query.id || '';

   Contents.remove({
      _id: id
   }).then(function() {
      res.render('admin/success', {
         message: "删除成功",
         url: '/admin/content'
      });
   })
});

module.exports = router;