const routes = require("express").Router();

const auth = require("./auth");
const templates = require("./templates");
const users = require("./users");

routes.use("/auth", auth);
routes.use("/templates", templates);
routes.use("/users", users);

module.exports = routes;
