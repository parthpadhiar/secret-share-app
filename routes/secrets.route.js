const express = require("express");
const routes = express.Router();
const { auth } = require("../middlewares/auth");
const secretController = require("../controllers/secrets.controller");

/**
 * {GET}
 * localhost:3000/
 * Welcome API
 */
routes.post("/api/secret", auth,secretController.addSecret);

/**
 * {PUT}
 * localhost:3000/api/secret/:secret_id
 * edit Secret 
 */
routes.put("/api/secret/:secret_id",auth, secretController.editSecret)

module.exports = routes;
