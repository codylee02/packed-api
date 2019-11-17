const xss = require("xss");
//const Treeize = require('treeize');

const TemplatesService = {
  getById(db, id, userId) {
    return db
      .from("pakd_templates AS template")
      .select("template.id", "template.name", "template.user_id")
      .where({
        id: id,
        user_id: userId
      })
      .first();
  },
  getUserTemplates(db, user_id) {
    return db
      .from("pakd_templates AS templates")
      .select("templates.id", "templates.name", "templates.user_id")
      .where("templates.user_id", user_id);
  },
  getUserTemplate(db, id, userId) {
    return db
      .from("pakd_templates AS templates")
      .select("templates.id", "templates.name", "templates.user_id")
      .where({
        id: id,
        user_id: userId
      })
      .first();
  },
  getTemplateItems(db, templateId) {
    return db
      .from("pakd_template_items AS items")
      .select("items.id", "items.name")
      .where("template_id", templateId);
  },
  insertTemplate(db, newTemplate) {
    return db
      .insert(newTemplate)
      .into("pakd_templates")
      .returning("*")
      .then(([template]) => template)
      .then(template =>
        TemplatesService.getById(db, template.id, template.user_id)
      );
  },
  insertTemplateItem(db, newTemplateItem) {
    return db
      .insert(newTemplateItem)
      .into("pakd_template_items")
      .returning("*")
      .then(([templateItem]) => templateItem);
  },
  deleteTemplate(db, template_id, user_id) {
    return db("pakd_templates")
      .where({
        id: template_id,
        user_id: user_id
      })
      .delete();
  },
  serializeTemplates(templates) {
    return templates.map(this.serializeTemplate);
  },
  serializeTemplate(template) {
    return {
      id: template.id,
      name: xss(template.name),
      date_created: template.date_created,
      user_id: template.user_id
    };
  },
  serializeTemplateItem(templateItem) {
    //console.log(templateItem.id)
    return {
      id: templateItem.id,
      name: xss(templateItem.name),
      template_id: templateItem.template_id
    };
  }
};

module.exports = TemplatesService;
