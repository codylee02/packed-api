const knex = require("knex");
const app = require("../../src/app");
const helpers = require("../test-helpers");

describe("Templates Endpoints", function() {
  let db;

  const {
    testUsers,
    testTemplates,
    testTemplateItems,
    testLists,
    testListItems
  } = helpers.makePAKDFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`GET /api/templates`, () => {
    context(`Given an xss attack template`, () => {
      const maliciousTemplateTitle = {
        id: testTemplates[0].id,
        name: `Naughty naughty very naughty <script>alert("xss");</script>Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        user_id: testUsers[0].id
      };
      const sanitizedTemplateTitle = [
        {
          id: testTemplates[0].id,
          name: `Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
          user_id: testUsers[0].id
        }
      ];

      beforeEach(() => helpers.seedUsers(db, testUsers));
      beforeEach("insert malicious template title", () => {
        return db.into("pakd_templates").insert(maliciousTemplateTitle);
      });
      it(`removes XSS attack content`, () => {
        return supertest(app)
          .get("/api/templates")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, sanitizedTemplateTitle);
      });
    });

    context(`Given no user templates`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/templates")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });
    });

    context(`Given there are templates in the database`, () => {
      beforeEach("insert templates", () =>
        helpers.seedPAKDTables(
          db,
          testUsers,
          testTemplates,
          testTemplateItems,
          testLists,
          testListItems
        )
      );

      it("responds with 200 and a list of templates", () => {
        const expectedTemplates = [
          {
            id: "e93c1802-8c16-4d06-a312-84359796449f",
            name: "Overnight Trip",
            user_id: testUsers[0].id
          },
          {
            id: "afb45b03-58f9-44ef-899d-61a3fbc4f9f9",
            name: "Daily Necessities",
            user_id: testUsers[0].id
          }
        ];

        return supertest(app)
          .get("/api/templates")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedTemplates);
      });
    });
  });

  describe(`POST /api/templates`, () => {
    context("Given an XSS attack template title", () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));
      const maliciousTemplateTitle = {
        name: `Naughty naughty very naughty <script>alert("xss");</script>Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        user_id: testUsers[0].id
      };
      const sanitizedTemplateTitle = {
        name: `Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
        user_id: testUsers[0].id
      };

      beforeEach("insert malicious template title", () => {
        return db.into("pakd_templates").insert(maliciousTemplateTitle);
      });

      it("removes XSS attack content", () => {
        const testUser = testUsers[0];
        return supertest(app)
          .post(`/api/templates`)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .send(maliciousTemplateTitle)
          .expect(201)
          .expect(res => {
            expect(res.body.name).to.eql(sanitizedTemplateTitle.name);
          });
      });
    });

    context(`Given a normal template`, () => {
      beforeEach(() =>
        helpers.seedPAKDTables(
          db,
          testUsers,
          testTemplates,
          testTemplateItems,
          testLists,
          testListItems
        )
      );

      it(`creats a template, responds 201 and the new template `, () => {
        const testUser = testUsers[1];

        const newTemplate = {
          name: "hello",
          user_id: testUser.id
        };

        return supertest(app)
          .post("/api/templates")
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .send(newTemplate)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property("id");
            expect(res.body.name).to.eql(newTemplate.name);
            expect(res.body.user_id).to.eql(newTemplate.user_id);
            expect(res.headers.location).to.eql(
              `/api/templates/${res.body.id}`
            );
          })
          .expect(res =>
            db
              .from("pakd_templates")
              .select("*")
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.name).to.eql(newTemplate.name);
                expect(row.user_id).to.eql(newTemplate.user_id);
              })
          );
      });
    });
  });

  describe(`GET /api/templates/:template_id`, () => {
    context(`Given /:template_id doesn't exist`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 404`, () => {
        const templateId = "dbeb0265-6d16-4e28-8fe1-da792263a29f";
        return supertest(app)
          .get(`/api/templates/${templateId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `Template doesn't exist` } });
      });
    });

    context(`Given there are templates in the database`, () => {
      beforeEach("insert templates", () =>
        helpers.seedPAKDTables(
          db,
          testUsers,
          testTemplates,
          testTemplateItems,
          testLists,
          testListItems
        )
      );

      it(`if exists, returns the template items and template title`, () => {
        const expectedTemplate = {
          templateName: "Overnight Trip",
          templateItems: [
            { id: "5fd85f4d-9fd9-4498-b237-f42690b067fe", name: "Shoes" },
            { id: "561c9c38-e26e-4cee-af78-ced14f215a73", name: "Socks" },
            { id: "5dbac38f-b77a-4593-8cf7-d833db38ea30", name: "Shirt" },
            { id: "000a572f-26a1-42ac-9b1f-8f261fb461ce", name: "Pants" },
            { id: "fb5d8517-58f8-4000-80b8-872a2f209128", name: "Jacket" }
          ]
        };
        return supertest(app)
          .get(`/api/templates/${testTemplates[0].id}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedTemplate);
      });
    });
  });

  describe(`POST /api/templates/:template_id`, () => {
    beforeEach(() =>
      helpers.seedPAKDTables(
        db,
        testUsers,
        testTemplates,
        testTemplateItems,
        testLists,
        testListItems
      )
    );

    it(`creates a new template item, responds 201 and the new template item`, () => {
      const testUser = testUsers[1];
      const templateId = testTemplates[2].id;

      const newTemplateItem = {
        name: "New Item Test"
      };

      return supertest(app)
        .post(`/api/templates/${templateId}`)
        .set("Authorization", helpers.makeAuthHeader(testUser))
        .send(newTemplateItem)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property("id");
          expect(res.body.name).to.eql(newTemplateItem.name);
          expect(res.body.template_id).to.eql(templateId);
        })
        .expect(res =>
          db
            .from("pakd_template_items")
            .select("*")
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.name).to.eql(newTemplateItem.name);
              expect(row.template_id).to.eql(templateId);
            })
        );
    });
  });

  describe(`DELETE /api/templates/:template_id`, () => {
    context(`Given no user templates`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 404`, () => {
        const testUser = testUsers[0];
        const templateToDelete = testTemplates[0].id;

        return supertest(app)
          .delete(`/api/templates/${templateToDelete}`)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(404, { error: { message: `Template doesn't exist` } });
      });
    });

    context("Given there are templates in the database", () => {
      beforeEach(() =>
        helpers.seedPAKDTables(
          db,
          testUsers,
          testTemplates,
          testTemplateItems,
          testLists,
          testListItems
        )
      );

      it("responds with 204 and removes the template", () => {
        const templateToDelete = testTemplates[0].id;
        const testUser = testUsers[0];
        const expectedTemplates = [
          {
            id: "afb45b03-58f9-44ef-899d-61a3fbc4f9f9",
            name: "Daily Necessities",
            user_id: testUsers[0].id
          }
        ];

        return supertest(app)
          .delete(`/api/templates/${templateToDelete}`)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(204)
          .then(() => {
            return supertest(app)
              .get("/api/templates")
              .set("Authorization", helpers.makeAuthHeader(testUser))
              .expect(expectedTemplates);
          });
      });
    });
  });

  describe(`PATCH /api/templates/:template_id`, () => {
    context(`Given no templates`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 404`, () => {
        const templateId = "abf45b03-58f9-44ef-899d-61a3fbc4f9f9";
        const testUser = testUsers[0];
        return supertest(app)
          .patch(`/api/templates/${templateId}`)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(404, { error: { message: `Template doesn't exist` } });
      });
    });

    context(`Given there are templates in the database`, () => {
      beforeEach(() =>
        helpers.seedPAKDTables(
          db,
          testUsers,
          testTemplates,
          testTemplateItems,
          testLists,
          testListItems
        )
      );

      it(`responds with 204 and updates the template's name`, () => {
        const testUser = testUsers[1];
        const templateIdToUpdate = testTemplates[2].id;
        const updateTemplateTitle = { name: "updated template title" };

        const expectedTemplateTitles = {
          ...testTemplates[2],
          ...updateTemplateTitle
        };
        delete expectedTemplateTitles.date_created;

        return supertest(app)
          .patch(`/api/templates/${templateIdToUpdate}`)

          .send(updateTemplateTitle)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/templates/`)
              .set("Authorization", helpers.makeAuthHeader(testUser))
              .expect([expectedTemplateTitles])
          );
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const testUser = testUsers[1];
        const templateIdToUpdate = testTemplates[2].id;
        return supertest(app)
          .patch(`/api/templates/${templateIdToUpdate}`)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .send({ irrlevantField: "foo" })
          .expect(400, {
            error: {
              message: `Missing 'name' in request body`
            }
          });
      });
    });
  });

  describe(`DELETE /api/templates/:template_id/:template_item_id`, () => {
    context(`Given no user templates`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 404`, () => {
        const testUser = testUsers[0];
        const templateId = testTemplates[0].id;
        const templateItemToDelete = testTemplateItems[0].id;

        return supertest(app)
          .delete(`/api/templates/${templateId}/${templateItemToDelete}`)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(404, { error: { message: `Template item doesn't exist` } });
      });
    });

    context("Given there are templates in the database", () => {
      beforeEach(() =>
        helpers.seedPAKDTables(
          db,
          testUsers,
          testTemplates,
          testTemplateItems,
          testLists,
          testListItems
        )
      );

      it("responds with 204 and removes the template", () => {
        const testUser = testUsers[0];
        const templateId = testTemplates[0].id;
        const templateItemToDelete = testTemplateItems[0].id;

        const expectedTemplateItems = {
          templateName: testTemplates[0].name,
          templateItems: [
            { ...testTemplateItems[1] },
            { ...testTemplateItems[2] },
            { ...testTemplateItems[3] },
            { ...testTemplateItems[4] }
          ]
        };

        expectedTemplateItems.templateItems.forEach(templateItem => {
          delete templateItem.date_created;
          delete templateItem.template_id;
        });

        return supertest(app)
          .delete(`/api/templates/${templateId}/${templateItemToDelete}`)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(204)
          .then(() => {
            return supertest(app)
              .get(`/api/templates/${templateId}`)
              .set("Authorization", helpers.makeAuthHeader(testUser))
              .expect(expectedTemplateItems);
          });
      });
    });
  });

  describe(`PATCH /api/templates/:teamplate_id/:template_item_id`, () => {
    context(`Given no templates`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 404`, () => {
        const templateId = "abf45b03-58f9-44ef-899d-61a3fbc4f9f9";
        const templateItemId = "abf45b03-58f9-44ef-899d-61a3fbc4f9f9";
        const testUser = testUsers[0];
        return supertest(app)
          .patch(`/api/templates/${templateId}/${templateItemId}`)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(404, { error: { message: `Template item doesn't exist` } });
      });
    });

    context(`Given there are templates in the database`, () => {
      beforeEach(() =>
        helpers.seedPAKDTables(
          db,
          testUsers,
          testTemplates,
          testTemplateItems,
          testLists,
          testListItems
        )
      );

      it(`responds with 204 and updates the template's name`, () => {
        const testUser = testUsers[1];
        const templateId = testTemplates[2].id;
        const templateItemIdToUpdate = testTemplateItems[11].id;
        const updateTemplateItem = { name: "updated item name" };

        const expectedTemplates = {
          templateName: testTemplates[2].name,
          templateItems: [
            testTemplateItems[12],
            testTemplateItems[13],
            testTemplateItems[14],
            testTemplateItems[15],
            testTemplateItems[16],
            testTemplateItems[17],
            { ...testTemplateItems[11], ...updateTemplateItem }
          ]
        };

        expectedTemplates.templateItems.forEach(templateItem => {
          delete templateItem.date_created;
          delete templateItem.template_id;
        });

        return supertest(app)
          .patch(`/api/templates/${templateId}/${templateItemIdToUpdate}`)
          .send(updateTemplateItem)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/templates/${templateId}`)
              .set("Authorization", helpers.makeAuthHeader(testUser))
              .expect(expectedTemplates)
          );
      });
      it(`responds with 400 when no required fields supplied`, () => {
        const testUser = testUsers[1];
        const templateId = testTemplates[2].id;
        const templateItemIdToUpdate = testTemplateItems[12].id;

        return supertest(app)
          .patch(`/api/templates/${templateId}/${templateItemIdToUpdate}`)
          .send({ irrelevantField: "none" })
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(400, {
            error: {
              message: `Missing 'name' in request body`
            }
          });
      });
    });
  });
});
