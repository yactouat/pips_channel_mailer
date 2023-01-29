const axios = require("axios");

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.getSubMessage = async (event, context) => {
  /**
   * `event.data` contains the email address of the newly created user
   *
   * you can also get the event attributes like so =>
   * event.attributes["some-attribute"]
   */
  const usrEmailMsg = event.data
    ? Buffer.from(event.data, "base64").toString()
    : "could not parse the Pub/Sub message";
  try {
    await axios.post(process.env.MAILER_SERVICE_URL, {
      userEmail: usrEmailMsg,
    });
    // TODO better observability here
    console.info(
      `sending email to ${usrEmailMsg} resulted in status code ${res.status}`
    );
  } catch (error) {
    console.error(error);
  }
};
