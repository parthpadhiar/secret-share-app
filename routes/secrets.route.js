const express = require("express");
const routes = express.Router();
const { auth } = require("../middlewares/auth");
const secretController = require("../controllers/secrets.controller");

const PATH = {
  SHOW_ALL_SECRETS: "/all",
  ADD_SECRET: "/add",
  EDIT_SECRET: "/edit/:secret_id",
  DELETE_SECRET: "/delete/:secret_id",
};

/**
 * {GET}
 * localhost:3000/api/secret/all
 * Logged In users secret only
 */
routes.get(PATH.SHOW_ALL_SECRETS, auth, secretController.showSecret)

/**
 * {POST}
 * localhost:3000/api/secret/add
 * Welcome API
 */
routes.post(PATH.ADD_SECRET, auth, secretController.addSecret);

/**
 * {PUT}
 * localhost:3000/api/secret/edit/:secret_id
 * edit Secret
 */
routes.put(PATH.EDIT_SECRET, auth, secretController.editSecret);

/**
 * {DELETE}
 *  localhost:3000/api/secret/delete/:secret_id
 * delete Secret
 */
routes.delete(PATH.DELETE_SECRET, auth, secretController.deleteSecret);

module.exports = routes;
