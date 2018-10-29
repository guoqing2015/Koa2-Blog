'use strict';
const bcrypt = require('bcryptjs')
const User = require('../proxy/user');

exports.getSignin = async (ctx) => {
  await ctx.render('blog/signin', {
    title: '用户登陆',
  });
}


exports.postSignin = async (ctx) => {
  try {
    const {
      name,
      password
    } = ctx.request.body;
    const userInfo = await User.getUserByName(name);
    if (!userInfo) {
      ctx.body = {
        code: 500,
        message: '用户不存在'
      }
      return;
    }
    if (userInfo && await bcrypt.compare(password, userInfo.password)) {
      ctx.session.user = {
        id: userInfo.id,
        name: userInfo.name,
        // isAdmin: userInfo.isAdmin,
        email: userInfo.email
      }
      ctx.body = {
        code: 200,
        message: '登录成功'
      }
    } else {
      ctx.body = {
        code: 500,
        message: '密码错误'
      }
    }
  } catch (error) {

  }
}


exports.getSignup = async (ctx) => {
  await ctx.render('blog/signup', {
    title: '用户注册'
  });
}

exports.postSignup = async (ctx) => {
  try {

    const salt = await bcrypt.genSalt(10);
    let {
      name,
      email,
      password,
      repassword
    } = ctx.request.body;
    let errMsg = '';
    if (name === '') {
      errMsg = '用户名不能为空'
    } else if (email === '') {
      errMsg = 'email不能为空'
    } else if (password === '') {
      errMsg = '密码不能为空'
    } else if (password !== repassword) {
      errMsg = '两次密码不一样'
    }
    if (errMsg) {
      ctx.body = {
        code: 500,
        message: errMsg
      }
      return;
    }
    let isUsernameExist = await User.getUserByName(name);
    if (isUsernameExist) {
      ctx.body = {
        code: 500,
        message: '用户名已注册'
      }
      return;
    }

    // check is email exist
    let isEmailExist = await User.getUserByEmail(email);
    if (isEmailExist) {
      message.message = '此邮箱已注册';
      ctx.body = message;
      return;
    }
    password = await bcrypt.hash(password, salt)

    var userInfo = {
      name,
      email,
      password
    }

    userInfo = await User.createUser(userInfo);

    ctx.session.user = userInfo;

    ctx.body = {
      code: 200,
      user: userInfo
    };

  } catch (error) {
    ctx.body = {
      code: 500,
      message: error.message
    }
  }

}