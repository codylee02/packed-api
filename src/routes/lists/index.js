const express = require("express");
const path = require("path");
const service = require("./service");
const { requireAuth } = require("../../middleware/jwt-auth");

const router = express.Router();
const jsonBodyParser = express.json();

router
  .route("/")
  .all(requireAuth)
  .all(checkListsExist)
  .get((req, res, next) => {
    user_id = req.user.id;
    service
      .getUserLists(req.app.get("db"), req.user.id)
      .then(lists => {
        res.json(service.serializeLists(lists));
        next();
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { name } = req.body;
    const newList = { name };

    for (const [key, value] of Object.entries(newList))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });

    newList.user_id = req.user.id;

    service
      .insertList(req.app.get("db"), newList)
      .then(list => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${list.id}`))
          .json(service.serializeList(list));
      })
      .catch(next);
  });

router
  .route("/:list_id")
  .all(requireAuth)
  .all(checkListExists)
  .get(jsonBodyParser, (req, res, next) => {
    const listId = req.params.list_id;
    const listName = res.list.name;

    service
      .getListItems(req.app.get("db"), listId)

      .then(listItems => {
        res.json(service.serializeSingleList({ listName, listItems }));
      })

      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const list_id = req.params.list_id;
    const name = req.body.name;
    const newListItem = { list_id, name };

    service
      .insertListItem(req.app.get("db"), newListItem)
      .then(newItem => {
        res.status(201).json(service.serializeListItem(newItem));
      })
      .catch(next);
  })
  .delete(jsonBodyParser, (req, res, next) => {
    service
      .deleteList(req.app.get("db"), req.params.list_id, req.user.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { name } = req.body;

    const listUpdate = { name };
    const userId = req.user.id;

    for (const [key, value] of Object.entries(listUpdate))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
    service
      .updateList(req.app.get("db"), userId, req.params.list_id, listUpdate)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

router
  .route("/:list_id/:list_item_id")
  .all(requireAuth)
  .all(checkListItemExists)
  .delete(jsonBodyParser, (req, res, next) => {
    const listItemId = req.params.list_item_id;
    const listId = req.params.list_id;

    service
      .deleteListItem(req.app.get("db"), listItemId, listId)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const listItemId = req.params.list_item_id;
    const listId = req.params.list_id;
    const { name, packed } = req.body;
    const listItemUpdate = { name, packed };

    const numberOfValues = Object.values(listItemUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'name' or 'packed'`
        }
      });
    service
      .updateListItem(req.app.get("db"), listId, listItemId, listItemUpdate)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

/* async/await syntax for promises */
async function checkListsExist(req, res, next) {
  try {
    const list = await service.getUserLists(req.app.get("db"), req.user.id);

    if (!list)
      return res.status(404).json({
        error: `Lists don't exist`
      });

    res.list = list;
    next();
  } catch (error) {
    next(error);
  }
}

async function checkListExists(req, res, next) {
  try {
    const list = await service.getById(
      req.app.get("db"),
      req.params.list_id,
      req.user.id
    );

    if (!list)
      return res.status(404).json({
        error: { message: `List doesn't exist` }
      });

    res.list = list;
    next();
  } catch (error) {
    next(error);
  }
}

async function checkListItemExists(req, res, next) {
  try {
    const listItem = await service.getListItemById(
      req.app.get("db"),
      req.params.list_item_id
    );

    if (!listItem)
      return res.status(404).json({
        error: { message: `List item doesn't exist` }
      });

    res.listItem = listItem;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = router;
