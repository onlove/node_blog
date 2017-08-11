/**
 * Created by DT274 on 2017/7/25.
 */
//加载express模块
var express = require('express');

//加载模板模块
var swig = require('swig');

//加载数据模块
var mongoose = require('mongoose');

//body-parser用来处理前端过来的post数据
var bodyParser = require('body-parser');

var Cookies = require('cookies');

//创建app应用 => nodejs http.createServer对象
var app = express();

var User = require('./models/user.js');

//设置静态文件托管
//当用户访问的url以/public,那么 直接返回这个目录"public"下的文件
app.use('/public', express.static(__dirname + '/public'));

//定义当前应用所用的模板引擎, 也就是模板的后缀名称，第二个参数表示用于解析处理模板内容的方法
app.engine('html', swig.renderFile);

//设置模板文件存放的目录，第一个参数是固定的的views, 第二个参数是目录名称
app.set('views', './views');

//注册所使用的模板引擎,第一个参数必须是view engine, 第二个参数和app.engine这个方法当中（第一个参数）是一致的
app.set('view engine', 'html');

//在开发过程当中，取消缓存的限制
swig.setDefaults({cache: false});

app.use(bodyParser.urlencoded({extended: true}));

//设置cookie
app.use(function(req, res, next) {
   req.cookies = new Cookies(req, res);

   //解析登录用户的信息
   req.userInfo = {};
   if (req.cookies.get('userInfo')) {
      try{
         req.userInfo = JSON.parse(req.cookies.get('userInfo'));

         //获取当前用户登录的用户类型, 是否是管理员
         User.findById(req.userInfo._id)
             .then(function(userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
             })

      }catch(e) {
         next();
      }
   } else {
      next();
   }
});

/*
* 根据不同功能划分模块
* */
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

//监听数据库
mongoose.connect('mongodb://localhost:27018/blog', {useMongoClient:true}, function(err) {
   if (err) {
      console.log("数据库连接失败");
   }else {
      console.log("数据库连接成功");
      //监听请求
      app.listen(8081);
   }
});





















app.get('/', function(req, res, next) {
   //res.send('欢迎光临我的博客')

   /*
   * 读取views目录下的指定文件，解析并返回给客户端
   * 第一个参数：模板文件，相对于views目录
   * */
   res.render('index')

});




















//app.get('/main.css', function(req, res, next) {
//   res.setHeader('content-type', 'text/css');
//   res.send('body {background: red}')
//});

//用户请求 --> url --> 解析路由 --> 找到匹配的路由 --> 指定绑定函数，返回对应的内容给客户端
// /public 静态文件处理，直接读取public下的文件
// 动态 --> 处理业务逻辑,加载模板, 解析模板 --> 返回给客户端