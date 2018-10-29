'use strict';
const moment = require('moment');
const Post = require('../proxy/post');
const Category = require('../proxy/category');

/**
 * 重置到文章页
 */
exports.getRedirectPosts = async ctx => {
  ctx.redirect('/posts')
}


/**
 * 文章页
 */
exports.getPosts = async (ctx) => {
  try {
    let page = ctx.query.body.page;
    const res = await Post.findPostByUserPage(page);
    ctx.render('blog/posts', {
      session: ctx.session,
      posts: res,
      postsLength: postCount,
      postsPageLength: Math.ceil(postCount / 10),
    })
  } catch (err) {
    ctx.body = {
      code: 500,
      err: err.message
    }
  }
}








/**
 * 新建文章
 * @param ctx
 * @returns {*}
 */
exports.createPost = async (ctx) => {
  try {

    let title = ctx.body.title;
    let content = ctx.body.content;
    if (!title) {
      await ctx.render('admin/error', {
        message: '文章标题不能为空'
      });
      return;
    }
    const res = await Post.createNewPost({
      title: ctx.body.title,
      content: ctx.body.content,
      category_id: ctx.body.category_id
    });
    await ctx.render('admin/success', {
      message: '文章新建成功',
      url: '/admin/post/list'
    })
  } catch (err) {
    await ctx.render('admin/error', {
      message: err.message
    })
  }
};

/**
 * 编辑文章
 */
exports.editPost = async (ctx) => {
  try {
    let data = {
      title: ctx.body.title,
      content: ctx.body.content,
      category_id: ctx.body.category_id,
      id: ctx.query.id,
    };
    if (!data.id) {
      ctx.body = {
        message: '缺少id'
      }
      return;
    }
    const res = await Post.updatePost(data);
    if (res.length == 1) {
      await ctx.render('admin/success', {
        message: '修改成功！',
        url: '/admin/post/edit?id=' + data.id
      })
    }
  } catch (err) {
    await ctx.render('admin/error', {
      message: err.message
    })
  }
}


/**
 * 删除文章
 * @param ctx
 * @returns {*}
 */
exports.deletePost = async (ctx) => {
  try {
    let id = ctx.query.id;
    if(!id) {
      await ctx.render('admin/error', {
        message: "文章id不存在"
      })
      return;
    }
    await Post.destroyPostById(id);
    await ctx.render('admin/success', {
      message: '文章删除成功！',
      url: '/admin/post/list'
    })
  } catch (err) {
    await ctx.render('admin/error', {
      message: err.message
    })
  }
};



/**
 * 文章列表页面
 */
exports.postListPage = async (ctx) => {
  try {
    const page = Number(ctx.query.page || 1);
    const limit = 10;
    var pages = 0;
    const result = await Post.getPostsAndCount(page, 10);
    var count = result.count;
    pages = Math.ceil(count / limit); //向上取整
    const posts = result.rows;
    for (let post of posts) {
      post.create_time = moment(post.createdAt).format("YYYY-MM-DD HH:mm:ss");
      let postCategory = await Category.getCategoryById(post.category_id);
      post.category = postCategory;
    }
    await ctx.render('admin/post_list.html', {
      posts: result.rows,
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
exports.postAddPage = async (ctx) => {
  try {

    const categories = await Category.getAllCategories();
    await ctx.render('admin/post_add.html', {
      categories: categories
    });
  } catch (err) {
    ctx.throw(err);
  }
}


/**
 * 文章列表页面
 */
exports.postEditPage = async (ctx) => {
  try {
    const id = ctx.query.id;
    if (!id) {
      await ctx.render('admin/error', {
        message: "未传入id"
      })
      return;
    }
    const post = await Post.getPostById(id);
    const categories = await Category.getAllCategories();
    if (post) {
      await ctx.render('admin/post_edit.html', {
        post,
        categories
      });
    } else {
      await ctx.render('admin/error', {
        message: `未查询到id为${id}的文章`
      })
    }
  } catch (err) {
    ctx.throw(err);
  }
}