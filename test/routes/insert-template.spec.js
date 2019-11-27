const knex = require("knex");
const app = require("../../src/app");
const helpers = require("../test-helpers");

describe("insert-template endpoints", function() {
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
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`POST /api/insert-template/:list_id/:template_id`, () => {
    context(`given there are no lists or templates in the database`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 404 and 'List doesn't exist'`, () => {
        const listId = testLists[0].id;
        const templateId = testTemplates[0].id;

        return supertest(app)
          .post(`/api/insert-template/${listId}/${templateId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `List doesn't exist` } });
      });
    });

    context(`given there are lists and templates in the database`, () => {
      beforeEach("seed tables", () =>
        helpers.seedPAKDTables(
          db,
          testUsers,
          testTemplates,
          testTemplateItems,
          testLists,
          testListItems
        )
      );

      it(`copies the template and inserts it into a list`, () => {
        const listId = testLists[1].id;
        const templateId = testTemplates[0].id;

        const expectedList = [
          { name: testListItems[10].name },
          { name: testListItems[11].name },
          { name: testListItems[12].name },
          { name: testListItems[13].name },
          { name: testListItems[14].name },
          { name: testListItems[15].name },
          { name: testListItems[16].name },
          { name: testTemplateItems[0].name },
          { name: testTemplateItems[1].name },
          { name: testTemplateItems[2].name },
          { name: testTemplateItems[3].name },
          { name: testTemplateItems[0].name }
        ];

        return supertest(app)
          .post(`/api/insert-template/${listId}/${templateId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(201)
          .expect(res => expect(res.body).to.be.an("array"))
          .expect(() =>
            db
              .from("pakd_list_items AS items")
              .select("items.name")
              .where("list_id", listId)
              .then(listNames => expect(listNames).to.eql(listNames))
          );
      });
    });
  });
});
