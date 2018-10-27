const Article = require('../models/article');
const Moment = require('moment');


/**
 * 新增文章
 */
exports.createNewArticle = async (params) => {
  return await Article.create(params);
}


/**
 * 获取所有文章
 */
exports.getArticlesAndCount = async  (page, limit, order) => {
  return await Article.findAndCountAll({
    offset: (page - 1) * limit,
    limit: limit,
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