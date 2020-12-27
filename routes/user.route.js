const express = require('express');
const routes = express.Router();
const { auth } = require('../middlewares/auth');

const userController = require('../controllers/user.controller.js');

const PATH = {
    REGISTER: '/api/register',
    LOGIN: '/api/login',
    PROFILE: '/api/profile',
    LOGOUT: '/api/logout'
}

/**
 * {GET}
 * localhost:3000/
 * Welcome API
 */
routes.get('/', userController.welcome)

/**
 * {POST}
 * localhost:3000/api/register
 * Registration API pass firstname, lastname, email, password, comfirm password
 */
routes.post(PATH.REGISTER, userController.register)

/**
 * {POST}
 * localhost:3000/api/login
 * Login API pass email, password
 */
routes.post(PATH.LOGIN, userController.login)

/**
 * {GET}
 * localhost:3000/api/profile
 * User profile         
 */
routes.get(PATH.PROFILE, auth, userController.profile)

/**
 * {GET}
 * localhost:3000/api/logout
 * Logout User
 */
routes.get(PATH.LOGOUT, userController.logout)

module.exports = routes;
