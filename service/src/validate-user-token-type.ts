import { TokenType } from "pips_resources_definitions/dist/types";

const validateUserTokenType = (
  userTokenType: TokenType
): userTokenType is TokenType => {
  return [
    "User_Authentication",
    "User_Deletion",
    "User_Modification",
    "User_Verification",
  ].includes(userTokenType);
};

export default validateUserTokenType;
