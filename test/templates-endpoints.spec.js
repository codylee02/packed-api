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
    beforeEach("seed tables", () => {
      helpers.seedPAKDTables(
        db,
        testUsers,
        testTemplates,
        testTemplateItems,
        testLists,
        testListItems
      );
    });

    it(`creates a new template and responds 201 and the new template`, () => {
      //this.retries(3);
      const testTemplate = testTemplates[0];
      const testUser = testUsers[0];
      const newTemplate = {
        name: "Test new template"
      };
      return supertest(app)
        .post("/api/templates")
        .send(newTemplate)
        .set("Authorization", helpers.makeAuthHeader(testUser))
        .expect(201);
      //.expect(res.body).to.have.property('id')
    });
    // it(`test`, () => {

    // })
  });
});
