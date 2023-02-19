import {
  getPgClient,
  migrateDb,
  saveUserToken,
} from "./../node_modules/pips_resources_definitions/dist/behaviors";

const truncateUsersTable = async () => {
  const pgClient = getPgClient();
  pgClient.connect();
  await pgClient.query("TRUNCATE TABLE users CASCADE");
  await pgClient.end();
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
    const pgClient = getPgClient();
    pgClient.connect();
    await pgClient.query(
      "INSERT INTO users(email, password, socialHandle, socialHandleType) VALUES ($1, $2, $3, $4) RETURNING *",
      [userEmail, "password", "handle", "LinkedIn"]
    );
    await pgClient.end();
    // act
    const actual = await saveUserToken(userEmail, "User_Verification");
    // assert
    expect(actual != "").toBe(true);
    // tear down
    await truncateUsersTable();
  });
});
