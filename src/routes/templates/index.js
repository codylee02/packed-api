const express = require("express");
const path = require("path");
const service = require("./service");
const { requireAuth } = require("../middleware/jwt-auth");

const router = express.Router();
const jsonBodyParser = express.json();

router
	.route("/")
	.all(requireAuth)
	.all(checkThingExists)

	//gets all of the templates for the user
	.get((req, res, next) => {
		user_id = req.user.id;
		service
			.getUserTemplates(req.app.get("db"), req.user.id)
			.then(templates => {
				res.json(templates);
				next();
			})
			.catch(next);
	})

	//post a new template
	.post(requireAuth, jsonBodyParser, (req, res, next) => {
		const { name } = req.body;
		const newTemplate = { name };

		for (const [key, value] of Object.entries(newTemplate))
			if (value == null)
				return res.status(400).json({
					error: `Missing '${key}' in request body`
				});

		newTemplate.user_id = req.user.id;

		service
			.insertTemplate(req.app.get("db"), newTemplate)
			.then(template => {
				res
					.status(201)
					.location(path.posix.join(req.originalUrl, `/${template.id}`))
					.json(service.serializeTemplate(template));
			})

			.catch(next);
	});

router
	.route("/:template_id")
	.all(requireAuth)
	.all(checkTemplateExists)
	.get((req, res) => {
		res.json(res.template);
	})
	.delete(requireAuth, jsonBodyParser, (req, res, next) => {
		console.log("request params", req.params);

		service
			.deleteTemplate(req.app.get("db"), req.params.template_id, req.user.id)
			.then(numRowsAffected => {
				res.status(204).end();
			})
			.catch(next);
	});
//.PATCH // EDIT TEMPLATE TITLE

router
	.route("/:template_id/template")
	.all(requireAuth)
	.all(checkTemplateExists)

	//get the template items for the template
	.get(jsonBodyParser, (req, res, next) => {
		const templateId = req.params.template_id;

		service
			.getTemplateItems(req.app.get("db"), templateId)

			.then(templateItems => {
				res.json(templateItems);
			})

			.catch(next);
	})

	// //post a new template item
	.post(jsonBodyParser, (req, res, next) => {
		const template_id = req.params.template_id;
		const name = req.body.name;
		const newTemplateItem = { template_id, name };

		service
			.insertTemplateItem(req.app.get("db"), newTemplateItem)
			.then(newItem => {
				res.status(201).json(service.serializeTemplateItem(newItem));
			})
			.catch(next);
	});

// //delete a template item
// .delete()

// //edit a template item
// .patch()

/* async/await syntax for promises */
async function checkThingExists(req, res, next) {
	try {
		const thing = await service.getUserTemplates(
			req.app.get("db"),
			req.user.id
		);

		if (!thing)
			return res.status(404).json({
				error: `Thing doesn't exist`
			});

		res.thing = thing;
		next();
	} catch (error) {
		next(error);
	}
}

async function checkTemplateExists(req, res, next) {
	try {
		const template = await service.getUserTemplate(
			req.app.get("db"),
			req.params.template_id,
			req.user.id
		);
		console.log("async func", template);

		if (!template)
			return res.status(404).json({
				error: { message: `Template doesn't exist` }
			});

		res.template = template;
		next();
	} catch (error) {
		next(error);
	}
}

module.exports = router;
