const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

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
          expect(res.headers.location).to.eql(`/api/templates/${res.body.id}`);
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

  describe(`GET /api/templates/:template_id`, () => {
    context(`Given no templates`, () => {
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
      it.skip(`if exists, returns the template items and template title`, () => {});
    });
  });
});
