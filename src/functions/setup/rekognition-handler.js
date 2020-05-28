const { COLLECTION_ID } = process.env;
const params = { CollectionId: COLLECTION_ID };

module.exports = rekognition => ({
  createCollection: () => rekognition.createCollection(params).promise(),
  deleteCollection: () => rekognition.deleteCollection(params).promise()
});
