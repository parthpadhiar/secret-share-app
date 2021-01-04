const express = require("express");
const routes = express.Router();
const { auth } = require("../middlewares/auth");
const secretTimelineController = require("../controllers/secretsTimeline.controller");

const PATH = {
  SHOW_SECRETS: "/api/timeline/secret/all",
};

/**
 * {GET}
 * localhost:3000/api/timeline/secret/all
 * Secrets timeline
 */
routes.get(PATH.SHOW_SECRETS, secretTimelineController.showAllSecrets)

module.exports = routes;
