/**
 * Created by DT274 on 2017/7/25.
 */
var express = require('express');
var router = express.Router();

router.use('/', function(req, res) {
    res.render('main/index', {
        userInfo: req.userInfo
    });
});

module.exports = router;