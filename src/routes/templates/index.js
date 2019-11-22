const express = require("express");
const path = require("path");
const service = require("./service");
const { requireAuth } = require("../../middleware/jwt-auth");

const router = express.Router();
const jsonBodyParser = express.json();

router
  .route("/")
  .all(requireAuth)
  .all(checkTemplatesExist)
  .get((req, res, next) => {
    user_id = req.user.id;
    service
      .getUserTemplates(req.app.get("db"), req.user.id)
      .then(templates => {
        res.json(service.serializeTemplates(templates));
        next();
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
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
  .get(jsonBodyParser, (req, res, next) => {
    const templateId = req.params.template_id;
    const templateName = res.template.name;

    service
      .getTemplateItems(req.app.get("db"), templateId)

      .then(templateItems => {
        res.json(
          service.serializeSingleTemplate({ templateName, templateItems })
        );
      })

      .catch(next);
  })
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
  })
  .delete(jsonBodyParser, (req, res, next) => {
    service
      .deleteTemplate(req.app.get("db"), req.params.template_id, req.user.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { name } = req.body;
    const templateUpdate = { name };
    const userId = req.user.id;

    for (const [key, value] of Object.entries(templateUpdate))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
    service
      .updateTemplate(
        req.app.get("db"),
        userId,
        req.params.template_id,
        templateUpdate
      )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

router
  .route("/:template_id/:template_item_id")
  .all(requireAuth)
  .all(checkTemplateItemExists)
  .delete(jsonBodyParser, (req, res, next) => {
    const templateItemId = req.params.template_item_id;
    const templateId = req.params.template_id;

    service
      .deleteTemplateItem(req.app.get("db"), templateItemId, templateId)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const templateItemId = req.params.template_item_id;
    const templateId = req.params.template_id;
    const { name } = req.body;
    const templateItemUpdate = { name };

    for (const [key, value] of Object.entries(templateItemUpdate))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
    service
      .updateTemplateItem(
        req.app.get("db"),
        templateId,
        templateItemId,
        templateItemUpdate
      )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

/* async/await syntax for promises */
async function checkTemplatesExist(req, res, next) {
  try {
    const template = await service.getUserTemplates(
      req.app.get("db"),
      req.user.id
    );

    if (!template)
      return res.status(404).json({
        error: `Templates don't exist`
      });

    res.template = template;
    next();
  } catch (error) {
    next(error);
  }
}

async function checkTemplateExists(req, res, next) {
  try {
    const template = await service.getById(
      req.app.get("db"),
      req.params.template_id,
      req.user.id
    );

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

async function checkTemplateItemExists(req, res, next) {
  try {
    const templateItem = await service.getTemplateItemById(
      req.app.get("db"),
      req.params.template_item_id
    );

    if (!templateItem)
      return res.status(404).json({
        error: { message: `Template item doesn't exist` }
      });

    res.templateItem = templateItem;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = router;
