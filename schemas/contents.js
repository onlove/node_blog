/**
 * Created by DT274 on 2017/7/25.
 */
var mongoose = require('mongoose');

//内容表结构
module.exports = new mongoose.Schema({

    //关联字段 --> 内容分类id
    category: {
         //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Category'
    },

    //内容标题
    title: String,

    //关联用户 --用户id
    user: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'User'
    },

    addTime: {
        type: Date,
        default: new Date()
    },

    //阅读量
    views: {
        type: Number,
        default: 0
    },

    //简介
    description: {
        type: String,
        default: ''
    },
    //内容
    content: {
        type: String,
        default: ''
    },

    //存储评论
    comments: {
        type: Array,
        default: []
    }
});
