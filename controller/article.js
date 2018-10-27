'use strict';
const Article = require('../proxy/article');
const Category = require('../proxy/category');

/**
 * 文章列表页面
 */
exports.articleListPage = async (ctx) => {
  try {
    const page = Number(ctx.query.page || 1);
    const limit = 10;
    var pages = 0;
    const result = await Article.getArticlesAndCount(page, 10);
    var count = result.count;
    pages = Math.ceil(count / limit); //向上取整
    console.log(result.rows)
    await ctx.render('admin/article_list.html', {
      articles: result.rows,
      count: count,
      page: page,
      pages: pages,
      limit: limit
    });
  } catch (err) {
    ctx.throw(err);
  }
}

/**
 * 文章列表页面
 */
exports.articleAddPage = async (ctx) => {
  try {
    
    const categories = await Category.getAllCategories();
    await ctx.render('admin/article_add.html', {
      categories: categories
    });
  } catch (err) {
    ctx.throw(err);
  }
}


/**
 * 新建文章
 * @param ctx
 * @returns {*}
 */
exports.createArticle = async (ctx) => {
  try {
 
    let title = ctx.body.title;
    let content = ctx.body.content;
    if (!title) {
      await ctx.render('admin/error', {
        message: '文章标题不能为空'
      });
      return;
    }
    const res = await Article.createNewArticle({
      title: ctx.body.title,
      content: ctx.body.content,
      category_id: ctx.body.category_id
    });
    await ctx.render('admin/success', {
      message: '文章新建成功',
      url: '/admin/article/list'
    }) 
  } catch (err) {
    await ctx.render('admin/error', {
      message: err.message
    })
  }
};
