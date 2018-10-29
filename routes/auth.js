'use strict';
import Router from 'koa-router'
const router = new Router()
const Auth = require('../controller/auth')

router.get('/signup', Auth.getSignup);
router.post('/signup', Auth.postSignup);

router.get('/signin', Auth.getSignin);
router.post('/signin', Auth.postSignin);

export default router