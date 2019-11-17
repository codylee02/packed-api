const routes = require("express").Router();

const authRouter = require("./auth/auth-router");
const usersRouter = require("./routes/users/users-router");
const templatesRouter = require("./templates/templates-router");

routes.use("/auth", authRouter);
routes.use("/users", usersRouter);
routes.use("/templates", templatesRouter);

module.exports = routes;
