const AWS = require("aws-sdk");
const RekognitionHandler = require("./rekognition-handler");
const ResponseHandler = require("./response-handler");
const S3Handler = require("./s3-handler");

const { REGION } = process.env;

exports.handler = (event, context, callback) => {
  const { createCollection, deleteCollection } = RekognitionHandler(
    new AWS.Rekognition({ region: REGION })
  );
  const { copyFiles, removeFiles, writeSettings } = S3Handler(new AWS.S3());
  const { sendResponse } = ResponseHandler(event, context, callback);

  const eventType = event.RequestType;
  let actions;

  if (eventType === "Create") {
    console.log("Creating resources");
    actions = [copyFiles(), writeSettings(), createCollection()];
  } else if (eventType === "Delete") {
    console.log("Deleting resources");
    actions = [removeFiles(), deleteCollection()];
  }

  Promise.all(actions)
    .then(() => {
      console.log("All actions successfully performed");
      return sendResponse("SUCCESS", {
        Message: `Resources successfully ${eventType.toLowerCase()}d`,
      });
    })
    .catch((err) => console.log(err) || sendResponse("FAILED"));
};
