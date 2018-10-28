const Post = require('../models/post');
const Moment = require('moment');


/**
 * 新增文章
 */
exports.createNewPost = async (params) => {
  return await Post.create(params);
}


/**
 * 根据id查询文章
 */
exports.getPostById = async (id) => {
  return await Post.findById(id);
}


/**
 * 获取所有文章
 */
exports.getPostsAndCount = async (page, limit, order) => {
  return await Post.findAndCountAll({
    offset: (page - 1) * limit,
    limit: limit,
    // order: [order],
  });
}

/**
 * 创建文章
 */
exports.createPost = async (params) => {
  if (!params) {
    return {};
  }
  return await Post.create(params);
}

/**
 * 编辑文章
 */
exports.updatePost = async (params) => {
  return await Post.update({
    title: params.title,
    content: params.content,
    category_id: params.category_id,
  }, {
    where: {
      id: params.id
    }
  })
}

/**
 * 删除文章
 */
exports.destroyPostById = async (id) => {
  return await Post.destroy({
    where: {
      id: id
    }
  })
}