const Article = require('../models/article');
const Moment = require('moment');


/**
 * 创建文章
 */
exports.getArticlesAndCount = async (params) => {
  if (!params) {
    return {};
  }
  return await Article.findAndCountAll({
    offset: (params.pageNum - 1) * params.pageSize,
    limit: params.pageSize,
    // order: [order],
  });
}

/**
 * 创建文章
 */
exports.createArticle = async (params) => {
  if (!params) {
    return {};
  }
  return await Article.create(params);
}

/**
 * 删除文章
 */
exports.destroyArticle = async (id) => {
  if(!id) {
    return {}
  };
  return await Article.destroy({
    where: {
      id: id
    }
  })
}