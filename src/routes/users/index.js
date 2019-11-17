const express = require("express");
const path = require("path");
const service = require("./service");

const router = express.Router();
const jsonBodyParser = express.json();

router.post("/", jsonBodyParser, (req, res, next) => {
	const { password, username, first_name, last_name } = req.body;

	for (const field of ["first_name", "last_name", "username", "password"])
		if (!req.body[field])
			return res.status(400).json({
				error: `Missing '${field}' in request body`
			});

	const passwordError = service.validatePassword(password);

	if (passwordError) return res.status(400).json({ error: passwordError });

	service
		.hasUserWithUserName(req.app.get("db"), username)
		.then(hasUserWithUserName => {
			if (hasUserWithUserName)
				return res.status(400).json({ error: `Username already taken` });

			return service.hashPassword(password).then(hashedPassword => {
				const newUser = {
					username,
					password: hashedPassword,
					first_name,
					last_name,
					date_created: "now()"
				};
				return service.insertUser(req.app.get("db"), newUser).then(user => {
					res
						.status(201)
						.location(path.posix.join(req.originalUrl, `/${user.id}`))
						.json(service.serializeUser(user));
				});
			});
		})
		.catch(next);
});

module.exports = router;
