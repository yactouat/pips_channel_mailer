import {
  getPgClient,
  getUserFromDb,
} from "pips_resources_definitions/dist/behaviors";
import { TokenResource } from "pips_resources_definitions/dist/resources";

const saveUserVerifToken = async (
  userEmail: string,
  token: string
): Promise<boolean> => {
  let outcome = false;
  // we need two connections here: one for the token and one for the association, that uses the returned token id
  const pgClient1 = getPgClient();
  const pgClient2 = getPgClient();
  // creating a validation token
  const verifToken: TokenResource = {
    type: "User_Verification",
    token: token,
  };
  try {
    // get user linked to email
    const user = await getUserFromDb(userEmail, getPgClient());
    if (user != null) {
      // store validation token in database
      await pgClient1.connect();
      const insertToken = await pgClient1.query(
        "INSERT INTO tokens(token) VALUES ($1) RETURNING *",
        [verifToken.token]
      );
      await pgClient1.end();
      const token = insertToken.rows[0] as TokenResource;
      // store token association with user in database
      await pgClient2.connect();
      await pgClient2.query(
        "INSERT INTO tokens_users(token_id, user_id, type) VALUES ($1, $2, $3) RETURNING *",
        [token.id, user.id, verifToken.type.toLowerCase()]
      );
      await pgClient2.end();
      outcome = true;
    }
  } catch (error) {
    console.error(error);
  }
  return outcome;
};

export default saveUserVerifToken;
