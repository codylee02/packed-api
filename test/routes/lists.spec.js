const knex = require("knex");
const app = require("../../src/app");
const helpers = require("../test-helpers");

describe("Lists Endpoints", function() {
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

  describe(`GET /api/lists`, () => {
    context(`Given an xss attack list`, () => {
      const maliciousListTitle = {
        id: testLists[0].id,
        name: `Naughty naughty very naughty <script>alert("xss");</script>Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        user_id: testUsers[0].id
      };
      const sanitizedListTitle = [
        {
          id: testLists[0].id,
          name: `Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
          user_id: testUsers[0].id
        }
      ];

      beforeEach(() => helpers.seedUsers(db, testUsers));
      beforeEach("insert malicious template title", () => {
        return db.into("pakd_lists").insert(maliciousListTitle);
      });
      it(`removes XSS attack content`, () => {
        return supertest(app)
          .get("/api/lists")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, sanitizedListTitle);
      });
    });

    context(`Given no user lists`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/lists")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });
    });

    context(`Given there are lists in the database`, () => {
      beforeEach("insert lists", () =>
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
        const expectedLists = [
          {
            id: testLists[0].id,
            name: testLists[0].name,
            user_id: testLists[0].user_id
          },
          {
            id: testLists[1].id,
            name: testLists[1].name,
            user_id: testLists[1].user_id
          }
        ];

        return supertest(app)
          .get("/api/lists")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedLists);
      });
    });
  });

  describe(`POST /api/lists`, () => {
    context("Given an XSS attack list title", () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));
      const maliciousListTitle = {
        name: `Naughty naughty very naughty <script>alert("xss");</script>Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        user_id: testUsers[0].id
      };
      const sanitizedListTitle = {
        name: `Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
        user_id: testUsers[0].id
      };

      beforeEach("insert malicious list title", () => {
        return db.into("pakd_lists").insert(maliciousListTitle);
      });

      it("removes XSS attack content", () => {
        const testUser = testUsers[0];
        return supertest(app)
          .post(`/api/lists`)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .send(maliciousListTitle)
          .expect(201)
          .expect(res => {
            expect(res.body.name).to.eql(sanitizedListTitle.name);
          });
      });
    });

    context(`Given a normal list`, () => {
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

        const newList = {
          name: "new list test",
          user_id: testUser.id
        };

        return supertest(app)
          .post("/api/lists")
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .send(newList)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property("id");
            expect(res.body.name).to.eql(newList.name);
            expect(res.body.user_id).to.eql(newList.user_id);
            expect(res.headers.location).to.eql(`/api/lists/${res.body.id}`);
          })
          .expect(res =>
            db
              .from("pakd_lists")
              .select("*")
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.name).to.eql(newList.name);
                expect(row.user_id).to.eql(newList.user_id);
              })
          );
      });
    });
  });

  describe(`GET /api/lists/:list_id`, () => {
    context(`Given /:list_id doesn't exist`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 404`, () => {
        const listId = "dbeb0265-6d16-4e28-8fe1-da792263a29f";
        return supertest(app)
          .get(`/api/lists/${listId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `List doesn't exist` } });
      });
    });

    context(`Given there are lists in the database`, () => {
      beforeEach("insert lists", () =>
        helpers.seedPAKDTables(
          db,
          testUsers,
          testTemplates,
          testTemplateItems,
          testLists,
          testListItems
        )
      );

      it(`if exists, returns the list items and list title`, () => {
        const expectedList = {
          listName: testLists[1].name,
          listItems: [
            {
              id: testListItems[10].id,
              name: testListItems[10].name,
              packed: testListItems[10].packed
            },
            {
              id: testListItems[11].id,
              name: testListItems[11].name,
              packed: testListItems[11].packed
            },
            {
              id: testListItems[12].id,
              name: testListItems[12].name,
              packed: testListItems[12].packed
            },
            {
              id: testListItems[13].id,
              name: testListItems[13].name,
              packed: testListItems[13].packed
            },
            {
              id: testListItems[14].id,
              name: testListItems[14].name,
              packed: testListItems[14].packed
            },
            {
              id: testListItems[15].id,
              name: testListItems[15].name,
              packed: testListItems[15].packed
            },
            {
              id: testListItems[16].id,
              name: testListItems[16].name,
              packed: testListItems[16].packed
            }
          ]
        };
        return supertest(app)
          .get(`/api/lists/${testLists[1].id}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedList);
      });
    });
  });

  describe(`POST /api/lists/:list_id`, () => {
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

    it(`creates a new list item, responds 201 and the new list item`, () => {
      const testUser = testUsers[2];
      const listId = testLists[2].id;

      const newListItem = {
        name: "New Item Test"
      };

      return supertest(app)
        .post(`/api/lists/${listId}`)
        .set("Authorization", helpers.makeAuthHeader(testUser))
        .send(newListItem)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property("id");
          expect(res.body.name).to.eql(newListItem.name);
          expect(res.body.list_id).to.eql(listId);
        })
        .expect(res =>
          db
            .from("pakd_list_items")
            .select("*")
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.name).to.eql(newListItem.name);
              expect(row.list_id).to.eql(listId);
            })
        );
    });
  });

  describe(`DELETE /api/lists/:list_id`, () => {
    context(`Given no user lists`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 404`, () => {
        const testUser = testUsers[0];
        const listToDelete = testLists[0].id;

        return supertest(app)
          .delete(`/api/lists/${listToDelete}`)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(404, { error: { message: `List doesn't exist` } });
      });
    });

    context("Given there are lists in the database", () => {
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

      it("responds with 204 and removes the list", () => {
        const listToDelete = testLists[0].id;
        const testUser = testUsers[0];
        const expectedLists = [
          {
            id: testLists[1].id,
            name: testLists[1].name,
            user_id: testLists[1].user_id
          }
        ];

        return supertest(app)
          .delete(`/api/lists/${listToDelete}`)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(204)
          .then(() => {
            return supertest(app)
              .get("/api/lists")
              .set("Authorization", helpers.makeAuthHeader(testUser))
              .expect(expectedLists);
          });
      });
    });
  });

  describe(`PATCH /api/lists/:list_id`, () => {
    context(`Given no lists`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 404`, () => {
        const listId = "abf45b03-58f9-44ef-899d-61a3fbc4f9f9";
        const testUser = testUsers[0];
        return supertest(app)
          .patch(`/api/lists/${listId}`)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(404, { error: { message: `List doesn't exist` } });
      });
    });

    context(`Given there are lists in the database`, () => {
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

      it(`responds with 204 and updates the list's name`, () => {
        const testUser = testUsers[2];
        const listIdToUpdate = testLists[2].id;
        const updateListTitle = { name: "updated template title" };

        const expectedListTitles = {
          ...testLists[2],
          ...updateListTitle
        };
        delete expectedListTitles.date_created;

        return supertest(app)
          .patch(`/api/lists/${listIdToUpdate}`)

          .send(updateListTitle)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/lists/`)
              .set("Authorization", helpers.makeAuthHeader(testUser))
              .expect([expectedListTitles])
          );
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const testUser = testUsers[2];
        const listIdToUpdate = testLists[2].id;
        return supertest(app)
          .patch(`/api/lists/${listIdToUpdate}`)
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

  describe(`DELETE /api/lists/:list_id/:list_item_id`, () => {
    context(`Given no user lists`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 404`, () => {
        const testUser = testUsers[0];
        const listId = testLists[0].id;
        const listItemToDelete = testListItems[0].id;

        return supertest(app)
          .delete(`/api/lists/${listId}/${listItemToDelete}`)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(404, { error: { message: `List item doesn't exist` } });
      });
    });

    context("Given there are lists in the database", () => {
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

      it("responds with 204 and removes the list item", () => {
        const testUser = testUsers[0];
        const listId = testLists[0].id;
        const listItemToDelete = testListItems[0].id;

        const expectedListItems = {
          listName: testLists[0].name,
          listItems: [
            { ...testListItems[1] },
            { ...testListItems[2] },
            { ...testListItems[3] },
            { ...testListItems[4] },
            { ...testListItems[5] },
            { ...testListItems[6] },
            { ...testListItems[7] },
            { ...testListItems[8] },
            { ...testListItems[9] }
          ]
        };

        expectedListItems.listItems.forEach(listItem => {
          delete listItem.date_created;
          delete listItem.list_id;
        });

        return supertest(app)
          .delete(`/api/lists/${listId}/${listItemToDelete}`)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(204)
          .then(() => {
            return supertest(app)
              .get(`/api/lists/${listId}`)
              .set("Authorization", helpers.makeAuthHeader(testUser))
              .expect(expectedListItems);
          });
      });
    });
  });

  describe(`PATCH /api/lists/:list_id/:list_item_id`, () => {
    context(`Given no lists`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 404`, () => {
        const listId = testLists[0].id;
        const listItemId = testListItems[0].id;
        const testUser = testUsers[0];
        return supertest(app)
          .patch(`/api/lists/${listId}/${listItemId}`)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(404, { error: { message: `List item doesn't exist` } });
      });
    });

    context(`Given there are lists in the database`, () => {
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

      it(`responds with 204 and updates the list`, () => {
        const testUser = testUsers[2];
        const listId = testLists[2].id;
        const listItemIdToUpdate = testListItems[17].id;
        const updateListItem = {
          name: "updated item name",
          packed: !testListItems[17].packed
        };

        const expectedList = {
          listName: testLists[2].name,
          listItems: [
            testListItems[18],
            testListItems[19],
            testListItems[20],
            testListItems[21],
            testListItems[22],
            testListItems[23],
            testListItems[24],
            testListItems[25],
            testListItems[26],
            testListItems[27],
            testListItems[28],
            testListItems[29],
            testListItems[30],
            testListItems[31],
            { ...testListItems[17], ...updateListItem }
          ]
        };

        expectedList.listItems.forEach(listItem => {
          delete listItem.date_created;
          delete listItem.list_id;
        });

        return supertest(app)
          .patch(`/api/lists/${listId}/${listItemIdToUpdate}`)
          .send(updateListItem)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/lists/${listId}`)
              .set("Authorization", helpers.makeAuthHeader(testUser))
              .expect(expectedList)
          );
      });
      it(`responds with 400 when no required fields supplied`, () => {
        const testUser = testUsers[1];
        const listId = testLists[2].id;
        const listItemIdToUpdate = testListItems[18].id;

        return supertest(app)
          .patch(`/api/lists/${listId}/${listItemIdToUpdate}`)
          .send({ irrelevantField: "none" })
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(400, {
            error: {
              message: `Request body must contain either 'name' or 'packed'`
            }
          });
      });
    });
  });
});
