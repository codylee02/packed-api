const express = require('express');
const path = require('path');
const TemplatesService = require('./templates-service');
const { requireAuth } = require('../middleware/jwt-auth')

const templatesRouter = express.Router();
const jsonBodyParser = express.json();

// templatesRouter
// .route("/")
// .get(requireAuth, (req, res, next) => {
//     user_id = req.user.id;
//     TemplatesService.getUserTemplates(req.app.get('db'), req.user.id)
//     .then(templates => {
//         res.json(templates)
//         next();
//     })
//     .catch(next)
// });

// templatesRouter
//  .route("/")
// .all(requireAuth)
// .all(checkThingExists)
// .get((req, res, next) => {
//     user_id = req.user.id;
//     TemplatesService.getUserTemplates(req.app.get('db'), req.user.id)
//     .then(templates => {
//         res.json(templates)
//         next();
//     })
//     .catch(next);
// })

templatesRouter
.route('/')
.post(requireAuth, jsonBodyParser, (req, res, next) => {
    console.log(req.body)
    const { name } = req.body;
    const newTemplate = { name }

    for(const [key, value] of Object.entries(newTemplate))
    if (value == null)
    return res.status(400).json({
        error: { message: `Missing '${key}' in request body`}
    })
    newTemplate.user_id = req.user.id

    TemplatesService.insertTemplate(req.app.get('db'), newTemplate)
    .then(template => {
        res.status(201)
        .location(path.posix.join(req.originalUrl, `/${template.id}`))
        .json(TemplatesService.serializeTemplate(template));
    })
    .catch(next)
})

/* async/await syntax for promises */
async function checkThingExists(req, res, next) {
    try {
      const thing = await TemplatesService.getUserTemplates(
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

module.exports = templatesRouter