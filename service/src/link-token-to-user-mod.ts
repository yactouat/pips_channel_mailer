import { getPgClient } from "pips_resources_definitions/dist/behaviors";

const linkTokenToUserMod = async (
  userToken: string,
  userModId: number
): Promise<boolean> => {
  let tokenAssociated = false;
  const tokenAssociationQueryClient = getPgClient();
  try {
    // store token association with user in database
    await tokenAssociationQueryClient.connect();
    await tokenAssociationQueryClient.query(
      `UPDATE pending_user_modifications 
       SET token_id = (SELECT id FROM tokens WHERE token = $1) 
       WHERE id = $2 RETURNING *`,
      [userToken, userModId]
    );
    await tokenAssociationQueryClient.end();
    tokenAssociated = true;
  } catch (error) {
    console.error(error);
  }
  return tokenAssociated;
};

export default linkTokenToUserMod;
