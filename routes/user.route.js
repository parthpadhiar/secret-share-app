const express = require("express");
const routes = express.Router();
const { auth } = require("../middlewares/auth");
const secretsRoute = require("./secrets.route");

const userController = require("../controllers/user.controller.js");

const PATH = {
  REGISTER: "/api/register",
  LOGIN: "/api/login",
  PROFILE: "/api/profile",
  EDIT_PROFILE: "/api/edit_profile",
  LOGOUT: "/api/logout",
  SECRET: "/api/secret"
};

/**
 * Secrets Route
 */
routes.use(PATH.SECRET, secretsRoute)

/**
 * {GET}
 * localhost:3000/
 * Welcome API
 */
routes.get("/", userController.welcome);

/**
 * {POST}
 * localhost:3000/api/register
 * Registration API pass firstname, lastname, email, password, comfirm password
 */
routes.post(PATH.REGISTER, userController.register);

/**
 * {POST}
 * localhost:3000/api/login
 * Login API pass email, password
 */
routes.post(PATH.LOGIN, userController.login);

/**
 * {GET}
 * localhost:3000/api/logout
 * Logout User
 */
routes.get(PATH.LOGOUT, auth, userController.logout);

/**
 * {GET}
 * localhost:3000/api/profile
 * User profile
 */
routes.get(PATH.PROFILE, auth, userController.profile);

/**
 * {PUT}
 * localhost:3000/api/edit_profile
 * Update User Profile
 */
routes.put(PATH.EDIT_PROFILE, auth, userController.editProfile);

module.exports = routes;
