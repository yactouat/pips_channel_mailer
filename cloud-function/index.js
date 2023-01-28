/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.getSubMessage = (event, context) => {
  const message = event.data
    ? Buffer.from(event.data, "base64").toString()
    : "could not parse the Pub/Sub message";
  console.log(message, event.attributes);
};
