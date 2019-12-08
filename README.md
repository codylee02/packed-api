## PAKD server

This server provides the database and API endpoints for the PAKD client.

## Client:

[PAKD client (GitHub)](https://github.com/codylee02/packed-app)

## Tech / Framework Used:

- Express
- PostgreSQL

## Endpoints

### /login

### /templates - Requires Auth

- .get

  Returns an array of templates.

- .post

  Posts a new template

### /templates/:template_id - Requires Auth

- .get

  Returns items in a template matching the template_id parameter

- .post

  Posts a new item to a template that matches the template_id parameter

- .delete

  Deletes the template matching the template_id and subsequent template items

- .patch

  Updates the name of a template

### /templates/:template_id/:template_item_id - Requires Auth

- .delete

  Deletes the item matching template_item_id from within the template with template_id

- .patch

  Updates the item name matching template_item_id from within the template with template_id

### /lists - Requires Auth

- .get

  Returns an array of lists.

- .post

  Posts a new list

### /lists/:list_id - Requires Auth

- .get

  Returns items in a list matching the list_id parameter

- .post

  Posts a new item to a list that matches the list_id parameter

- .delete

  Deletes the list matching the list_id and subsequent list items

- .patch

  Updates the name of a list

### /lists/:list_id/:list_item_id - Requires Auth

- .delete

  Deletes the item matching list_item_id from within the list with list_id

- .patch

  Updates the item name matching list_item_id from within the list with list_id

### /insert-template/:list_id/:template_id - Requires Auth

- .post

  Gets the template items matching the template_id and puts them in the matching list_id
