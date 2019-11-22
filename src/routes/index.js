const routes = require("express").Router();

const auth = require("./auth");
const templates = require("./templates");
const insertTemplate = require("./insert-template");
const lists = require("./lists");
const users = require("./users");

routes.use("/auth", auth);
routes.use("/templates", templates);
routes.use("/lists", lists);
routes.use("/insert-template", insertTemplate);
routes.use("/users", users);

module.exports = routes;
