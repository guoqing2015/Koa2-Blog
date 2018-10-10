'use strict';
const Article = require('../proxy/article');
const Category = require('../proxy/category');

const moment = require('moment');


exports.queryArticles = async (ctx) => {
  await ctx.render('admin/article-list', {

  });
}

exports.editArticle = async (ctx) => {
  await ctx.render('admin/article-edit', {

  });
}



/**
 * 新建文章
 */
exports.createArticle = async (ctx) => {
  let message = {};
  message.result = false;
  try {
    let data = {
      title: ctx.body.title,
      content: ctx.body.content,
      category_id: ctx.body.category_id,
    };
    let article = await Article.createArticle(data);
    message.result = true;
    message.item = article;
    ctx.body = message;
  } catch (err) {
    console.log('error    333333')
    message.message = '新增文章出错';
    ctx.body = message;
  }
};


