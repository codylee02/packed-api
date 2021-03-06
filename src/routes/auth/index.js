const express = require("express");
const service = require("./service");

const router = express.Router();
const jsonBodyParser = express.json();

router.post("/login", jsonBodyParser, (req, res, next) => {
	const { username, password } = req.body;
	const loginUser = { username, password };

	for (const [key, value] of Object.entries(loginUser))
		if (value == null)
			return res.status(400).json({
				error: `Missing '${key}' in request body`
			});

	service
		.getUserWithUserName(req.app.get("db"), loginUser.username.toLowerCase())
		.then(dbUser => {
			if (!dbUser)
				return res.status(400).json({
					error: "Incorrect username or password"
				});
			return service
				.comparePasswords(loginUser.password, dbUser.password)
				.then(compareMatch => {
					if (!compareMatch)
						return res.status(400).json({
							error: "Incorrect username or password"
						});

					const sub = dbUser.username;
					const payload = { user_id: dbUser.id };
					res.send({
						authToken: service.createJwt(sub, payload)
					});
				});
		})

		.catch(next);
});

module.exports = router;
