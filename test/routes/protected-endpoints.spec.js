const knex = require("knex");
const app = require("../../src/app");
const helpers = require("../test-helpers");

describe(`Protected endpoints`, function() {
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

	const protectedEndpoints = [
		{
			name: "GET /api/templates",
			path: "/api/templates",
			method: supertest(app).get
		},
		{
			name: "POST /api/templates",
			path: "/api/templates",
			method: supertest(app).post
		},
		{
			name: "DELETE /api/templates/:template_id",
			path: "/api/templates/afb45b03-58f9-44ef-899d-61a3fbc4f9f9",
			method: supertest(app).delete
		},
		{
			name: "GET /api/templates/:template_id",
			path: "/api/templates/afb45b03-58f9-44ef-899d-61a3fbc4f9f9",
			method: supertest(app).get
		}
	];

	protectedEndpoints.forEach(endpoint => {
		describe(endpoint.name, () => {
			it(`responds 401 'Missing bearer token' when no bearer token`, () => {
				return endpoint
					.method(endpoint.path)
					.expect(401, { error: `Missing bearer token` });
			});

			it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
				const validUser = testUsers[0];
				const invalidSecret = "bad-secret";
				return endpoint
					.method(endpoint.path)
					.set(
						"Authorization",
						helpers.makeAuthHeader(validUser, invalidSecret)
					)
					.expect(401, { error: `Unauthorized request` });
			});

			it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
				const invalidUser = { username: "user-not-existy", id: 1 };
				return endpoint
					.method(endpoint.path)
					.set("Authorization", helpers.makeAuthHeader(invalidUser))
					.expect(401, { error: "Unauthorized request" });
			});
		});
	});
});
