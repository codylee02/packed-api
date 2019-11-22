const express = require("express");
const path = require("path");
const service = require("./service");
const { requireAuth } = require("../../middleware/jwt-auth");

const router = express.Router();
const jsonBodyParser = express.json();

router
  .route(`/:list_id/:template_id`)
  .all(requireAuth)
  .all(checkListAndTemplateExists)
  .post(jsonBodyParser, (req, res, next) => {
    const { list_id, template_id } = req.params;
    const copyParams = { list_id, template_id };
    const numberOfValues = Object.values(copyParams).filter(Boolean).length;
    if (numberOfValues !== 2)
      return res.status(400).json({
        error: {
          message: `Request body must contain listId and templateId`
        }
      });

    service
      .getTemplateToCopy(req.app.get("db"), template_id)
      .then(templateToCopy =>
        templateToCopy.map(templateItem => ({
          ...templateItem,
          list_id: list_id
        }))
      )
      .then(templateToCopy =>
        service.insertTemplateItemsIntoListItems(
          req.app.get("db"),
          templateToCopy
        )
      )
      .then(copiedItems =>
        res.status(201).json(service.serializeCopiedItems(copiedItems))
      )
      .catch(next);
  });

async function checkListAndTemplateExists(req, res, next) {
  try {
    const list = await service.getListById(
      req.app.get("db"),
      req.params.list_id,
      req.user.id
    );

    const template = await service.getTemplateById(
      req.app.get("db"),
      req.params.template_id,
      req.user.id
    );

    if (!list)
      return res.status(404).json({
        error: { message: `List doesn't exist` }
      });

    if (!template)
      return res.status(404).json({
        error: { message: `Template doesn't exist` }
      });

    res.list = list;
    res.template = template;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = router;
