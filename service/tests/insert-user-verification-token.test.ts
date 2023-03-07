import {
  migrateDb,
  runPgQuery,
  saveUserToken,
} from "./../node_modules/pips_resources_definitions/dist/behaviors";

const truncateUsersTable = async () => {
  await runPgQuery("TRUNCATE TABLE users CASCADE");
};

beforeAll(async () => {
  await migrateDb();
});

describe("insert user verification token", () => {
  it("returns false when user does not exist in db", async () => {
    const actual = await saveUserToken("ghost@domain.com", "User_Verification");
    expect(actual == "").toBe(true);
    // tear down
    await truncateUsersTable();
  });

  it("returns true when user exists in db", async () => {
    // arrange
    const userEmail = "yacine.touati.pro@gmail.com";
    await runPgQuery(
      "INSERT INTO users(email, password, socialHandle, socialHandleType) VALUES ($1, $2, $3, $4) RETURNING *",
      [userEmail, "password", "handle", "LinkedIn"]
    );
    // act
    const actual = await saveUserToken(userEmail, "User_Verification");
    // assert
    expect(actual != "").toBe(true);
    // tear down
    await truncateUsersTable();
  });
});
