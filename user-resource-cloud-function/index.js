const axios = require("axios");

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.transmitSubMessage = async (event, context) => {
  /**
   * `event.data` contains the email address of the newly created user
   *
   * you can also get the event attributes like so =>
   * event.attributes["some-attribute"]
   *
   * among those attributes is the event type (user verification, modification, etc.)
   */
  const usrEmailMsg = event.data
    ? Buffer.from(event.data, "base64").toString()
    : "could not parse the Pub/Sub message";
  const payload = {
    pipsToken: process.env.PIPS_TOKEN,
    userEmail: usrEmailMsg,
    userTokenType: event.attributes["userTokenType"],
  };

  console.log("PAYLOAD ", payload);
  console.log("EVENT ATTRIBUTES ", event.attributes);

  if (
    event.attributes["userTokenType"] == "User_Modification" &&
    (!event.attributes["userToken"] || !event.attributes["userModId"])
  ) {
    throw new Error(
      `userTokenType "User_Modification" was provided without a user token or user modification id`
    );
  }
  if (event.attributes["userTokenType"] == "User_Modification") {
    payload["userModId"] = parseInt(event.attributes["userModId"]);
    payload["userToken"] = event.attributes["userToken"];
  }

  await axios.post(process.env.MAILER_SERVICE_URL, payload);
  console.info(
    `sending email request to ${usrEmailMsg} resulted in status code ${res.status}`
  );
};
