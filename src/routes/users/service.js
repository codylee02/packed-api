const xss = require("xss");
const bcrypt = require("bcryptjs");

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const service = {
	hasUserWithUserName(db, username) {
		return db("pakd_users")
			.where({ username })
			.first()
			.then(user => !!user);
	},
	insertUser(db, newUser) {
		return db
			.insert(newUser)
			.into("pakd_users")
			.returning("*")
			.then(([user]) => user);
	},
	hashPassword(password) {
		return bcrypt.hash(password, 12);
	},
	serializeUser(user) {
		return {
			id: user.id,
			first_name: xss(user.first_name),
			last_name: xss(user.last_name),
			username: xss(user.username),
			date_created: new Date(user.date_created)
		};
	},
	validatePassword(password) {
		if (password.length < 8) {
			return "Password must be longer than 8 characters";
		}
		if (password.length > 72) {
			return "Password must be less than 72 characters";
		}
		if (password.startsWith(" ") || password.endsWith(" ")) {
			return "Password must not start or end with empty spaces";
		}
		if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
			return "Password must contain 1 upper case, lower case, number and special character";
		}
		return null;
	}
};

module.exports = service;
