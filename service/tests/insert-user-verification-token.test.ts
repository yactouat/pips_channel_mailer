import { migrateDb } from "./../node_modules/pips_resources_definitions/dist/behaviors";

beforeAll(async () => {
  await migrateDb();
});

describe("insert user verification token", () => {
  // TODO
  test("should run a test", () => {
    expect(true).toBe(true);
  });
});
