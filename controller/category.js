'use strict';
const Category = require('../proxy/category');

/**
 * 新建分类
 * @param ctx
 * @returns {*}
 */
exports.createCategory = async (ctx) => {
  try {
 
    let category_name = ctx.request.body.category_name
    if (category_name == '') {
      await ctx.render('admin/error', {
        message: '名称不能为空！！！！！'
      });
      return;
    }
    const res = await Category.createNewCategory({
      category_name
    });
    await ctx.render('admin/success', {
      message: '分类保存成功',
      url: '/admin/category/list'
    }) 
  } catch (err) {
    await ctx.render('admin/error', {
      message: err.message
    })
  }
};



/**
 * 编辑分类
 * @param ctx
 * @returns {*}
 */
exports.editCategory = async (ctx) => {
  try {
    //提取基本信息
    let data = {
      category_name: ctx.request.body.category_name,
      id: ctx.query.id,
    };
    if (!data.id) {
      ctx.body = {
        message: '缺少id'
      }
      return;
    }
    const res = await Category.updateCategoryName(data.id, data.category_name);
    if (res.length == 1) {
      await ctx.render('admin/success', {
        message: '修改成功！',
        url: '/admin/category/list'
      })
    }
  } catch (err) {
    await ctx.render('admin/error', {
      message: err.message
    })
  }
};


/**
 * 删除分类
 * @param ctx
 * @returns {*}
 */
exports.deleteCategory = async (ctx) => {
  try {
    let id = ctx.query.id;
    if(!id) {
      await ctx.render('admin/error', {
        message: "分类id不存在"
      })
      return;
    }
    await Category.destroyCategoryById(id);
    await ctx.render('admin/success', {
      message: '分类删除成功！',
      url: '/admin/category/list'
    })
  } catch (err) {
    await ctx.render('admin/error', {
      message: err.message
    })
  }
};

/**
 * 查询所有分类
 */
exports.queryCategories = async (ctx) => {
  let message = {};
  message.result = false;
  try {
    var categories = await Category.findAllCategories();
    message.result = true;
    message.categories = categories;
    ctx.body = message;
  } catch (err) {
    message.message = '删除分类出错';
    ctx.body = message;
  }
}

/**
 * 分类列表页面
 */
exports.categoryListPage = async (ctx) => {
  try {
    const page = Number(ctx.query.page || 1);
    const limit = 10;
    var pages = 0;
    const result = await Category.getCategoriesAndCount(page, 10);
    var count = result.count;
    pages = Math.ceil(count / limit); //向上取整
    await ctx.render('admin/category_list.html', {
      categories: result.rows,
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
 * 分类编辑页面
 */
exports.categoryEditPage = async (ctx) => {
  try {
    const id = ctx.query.id;
    const category = await Category.getCategoryById(id);
    if (category) {
      await ctx.render('admin/category_edit.html', {
        // userInfo:req.userInfo,
        category: category
      });
    } else {
      await ctx.render('admin/error', {
        message: '分类信息不存在'
      })
    }

  } catch (err) {
    ctx.throw(err);
  }
}
