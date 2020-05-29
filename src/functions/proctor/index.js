const AWS = require("aws-sdk");
const uuid = require("uuid").v4;

const { COLLECTION_ID, FACES_TABLENAME, REGION } = process.env;

const rekognition = new AWS.Rekognition({ region: REGION });
const dynamo = new AWS.DynamoDB({ region: REGION });

const respond = (statusCode, response) => ({
  statusCode,
  body: JSON.stringify(response),
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
});

exports.indexHandler = async (event) => {
  const ExternalImageId = uuid();
  const body = JSON.parse(event.body);

  const indexFace = () =>
    rekognition
      .indexFaces({
        CollectionId: COLLECTION_ID,
        ExternalImageId,
        Image: { Bytes: Buffer.from(body.image, "base64") },
      })
      .promise();

  const persistMetadata = () =>
    dynamo
      .putItem({
        Item: {
          CollectionId: { S: COLLECTION_ID },
          ExternalImageId: { S: ExternalImageId },
          FullName: { S: body.fullName },
        },
        TableName: FACES_TABLENAME,
      })
      .promise();

  try {
    await indexFace();
    await persistMetadata();
    return respond(200, { ExternalImageId });
  } catch (e) {
    console.log(e);
    return respond(500, { error: e });
  }
};

const fetchFaces = async (imageBytes) => {
  /*
    Detect Faces

    Uses Rekognition's DetectFaces functionality
    to ensure only one fece is present on videp
  */

  const facesTest = {
    TestName: "Face Detection",
  };

  const detectFaces = () =>
    rekognition.detectFaces({ Image: { Bytes: imageBytes } }).promise();

  try {
    const faces = await detectFaces();
    const nFaces = faces.FaceDetails.length;
    facesTest.Success = nFaces === 1;
    facesTest.Details = nFaces;
  } catch (e) {
    facesTest.Success = false;
    facesTest.Details = "Server error";
  }
  return facesTest;
};

const fetchLabels = async (imageBytes) => {
  /*
    Detect Labels

    Uses Rekognition's DetectLabels functionality
    to detect forbidden objects
  */

  const forbiddenObjects = ["Mobile Phone", "Cell Phone"];

  const labelsTest = {
    TestName: "Objects of Interest",
  };

  const detectLabels = () =>
    rekognition
      .detectLabels({ Image: { Bytes: imageBytes }, MinConfidence: 85 })
      .promise();

  try {
    const labels = await detectLabels();
    const forbidden = labels.Labels.filter((x) =>
      forbiddenObjects.includes(x.Name)
    );
    labelsTest.Success = forbidden.length === 0;
    labelsTest.Details = labelsTest.Success
      ? "0"
      : forbidden.map((x) => x.Name).join(", ");
  } catch (e) {
    labelsTest.Success = false;
    labelsTest.Details = "Server error";
  }
  return labelsTest;
};

const fetchModerationLabels = async (imageBytes) => {
  /*
    Detect Unsafe images

    Uses Rekognition's DetectModerationLabels functionality
  */
  const moderationLabelsTest = {
    TestName: "Unsafe Content",
  };

  const detectModerationLabels = () =>
    rekognition
      .detectModerationLabels({
        Image: { Bytes: imageBytes },
        MinConfidence: 85,
      })
      .promise();

  try {
    const labels = await detectModerationLabels();
    const nLabels = labels.ModerationLabels.length;
    moderationLabelsTest.Success = nLabels === 0;
    moderationLabelsTest.Details = moderationLabelsTest.Success
      ? "0"
      : labels.ModerationLabels.map((l) => l.Name).join(", ");
  } catch (e) {
    moderationLabelsTest.Success = false;
    moderationLabelsTest.Details = `Server error`;
  }

  return moderationLabelsTest;
};

const searchForIndexedFaces = async (imageBytes) => {
  /*
    Face Matching

    Uses Rekognition's SearchFacesByImage functionality 
    to match face across the database of previously 
    indexed faces
  */

  const faceMatchTest = {
    TestName: "Person Recognition",
    Success: false,
    Details: "0",
  };

  const searchFace = () =>
    rekognition
      .searchFacesByImage({
        CollectionId: COLLECTION_ID,
        FaceMatchThreshold: 85,
        MaxFaces: 1,
        Image: { Bytes: imageBytes },
      })
      .promise();

  const getFaceByExternalImageId = (id) =>
    dynamo
      .getItem({
        TableName: FACES_TABLENAME,
        Key: { ExternalImageId: { S: id } },
      })
      .promise();

  try {
    const faces = await searchFace();
    const faceDetails = await getFaceByExternalImageId(
      faces.FaceMatches[0].Face.ExternalImageId
    );

    if (faceDetails.Item) {
      faceMatchTest.Success = true;
      faceMatchTest.Details = faceDetails.Item.FullName.S;
    }
  } catch (e) {
    // When 0 faces are recognized, rekognition.searchFacesByImage throws an error
    console.log(e);
  }
  return faceMatchTest;
};

exports.processHandler = async (event) => {
  const body = JSON.parse(event.body);
  const imageBytes = Buffer.from(body.image, "base64");

  const result = await Promise.all([
    fetchLabels(imageBytes),
    searchForIndexedFaces(imageBytes),
    fetchFaces(imageBytes),
    fetchModerationLabels(imageBytes),
  ]);

  return respond(200, result);
};
