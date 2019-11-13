const xss = require('xss')
//const Treeize = require('treeize');

const TemplatesService = {
    getById(db, id) {
        return db
        .from('pakd_templates AS template')
        .select(
            'template.id',
            'template.name',
            'template.user_id'
        )
        .where('template.id', id)
        .first()
    },
    getUserTemplates(db, user_id) {
        return db
        .from('pakd_templates AS templates')
        .select(
            'templates.id',
            'templates.name',
            'templates.user_id',
        )
        .where('templates.user_id', user_id)
    },
    insertTemplate(db, newTemplate) {
        return db
        .insert(newTemplate)
        .into('pakd_templates')
        .returning('*')
        .then(([template]) => template)
        .then(template =>
            TemplatesService.getById(db, template.id)
            )
    },
    serializeTemplates(templates) {
        return templates.map(this.serializeTemplate)
    },
    serializeTemplate(template) {
        return {
            id: template.id,
            name: xss(template.name),
            date_created: template.date_created,
        }
    }
}

module.exports = TemplatesService