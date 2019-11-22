const xss = require("xss");

const service = {
  getById(db, id, userId) {
    return db
      .from("pakd_lists AS list")
      .select("list.id", "list.name", "list.user_id")
      .where({
        id: id,
        user_id: userId
      })
      .first();
  },
  getUserLists(db, user_id) {
    return db
      .from("pakd_lists AS lists")
      .select("lists.id", "lists.name", "lists.user_id")
      .where("lists.user_id", user_id);
  },
  getListItems(db, listId) {
    return db
      .from("pakd_list_items AS items")
      .select("items.id", "items.name", "items.packed")
      .where("list_id", listId);
  },
  getListItemById(db, itemId) {
    return db
      .from("pakd_list_items AS items")
      .select("items.id", "items.name", "items.packed")
      .where("id", itemId)
      .first();
  },
  insertList(db, newList) {
    return db
      .insert(newList)
      .into("pakd_lists")
      .returning("*")
      .then(([list]) => list)
      .then(list => service.getById(db, list.id, list.user_id));
  },
  insertListItem(db, newListItem) {
    return db
      .insert(newListItem)
      .into("pakd_list_items")
      .returning("*")
      .then(([listItem]) => listItem);
  },
  deleteList(db, list_id, user_id) {
    return db("pakd_lists")
      .where({
        id: list_id,
        user_id: user_id
      })
      .delete();
  },
  deleteListItem(db, listItemId, listId) {
    return db("pakd_list_items")
      .where({
        id: listItemId,
        list_id: listId
      })
      .delete();
  },
  serializeLists(lists) {
    return lists.map(this.serializeList);
  },
  serializeList(list) {
    return {
      id: list.id,
      name: xss(list.name),
      date_created: list.date_created,
      user_id: list.user_id
    };
  },
  serializeListItem(listItem) {
    return {
      id: listItem.id,
      name: xss(listItem.name),
      list_id: listItem.list_id,
      packed: listItem.packed
    };
  },
  serializeListItems(listItems) {
    return listItems.map(this.serializeListItem);
  },
  serializeSingleList({ listName, listItems }) {
    return {
      listName: xss(listName),
      listItems: this.serializeListItems(listItems)
    };
  },
  updateList(db, userId, listId, newListFields) {
    return db("pakd_lists")
      .where({ user_id: userId, id: listId })
      .update(newListFields);
  },
  updateListItem(db, listId, listItemId, listItemUpdate) {
    return db("pakd_list_items")
      .where({
        list_id: listId,
        id: listItemId
      })
      .update(listItemUpdate);
  }
};

module.exports = service;
