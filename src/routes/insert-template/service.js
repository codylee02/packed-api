const xss = require("xss");

const service = {
  getListById(db, id, userId) {
    return db
      .from("pakd_lists AS list")
      .select("list.id", "list.name", "list.user_id")
      .where({
        id: id,
        user_id: userId
      })
      .first();
  },
  getTemplateById(db, id, userId) {
    return db
      .from("pakd_templates AS template")
      .select("template.id", "template.name", "template.user_id")
      .where({
        id: id,
        user_id: userId
      })
      .first();
  },
  getTemplateToCopy(db, templateId) {
    return db
      .from("pakd_template_items AS temp_items")
      .select("temp_items.name")
      .where("template_id", templateId);
  },
  insertTemplateItemsIntoListItems(db, templateToCopy) {
    return db
      .insert(templateToCopy, [
        "items.id",
        "items.packed",
        "items.name",
        "items.list_id"
      ])
      .into("pakd_list_items AS items");
  },
  serializeCopiedItems(copiedItems) {
    return copiedItems.map(copiedItem => ({
      id: copiedItem.id,
      packed: copiedItem.packed,
      name: xss(copiedItem.name),
      list_id: copiedItem.list_id
    }));
  }
};

module.exports = service;
