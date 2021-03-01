import boto3
import json

COLLECTION_ID = "virtual-proctor-sample-collection"
EXTERNAL_IMAGE_ID = "ExampleImage"

# Image
imageName = "media/face-index.jpeg"

# Read image content
with open(imageName, "rb") as document:
    imageBytes = bytearray(document.read())

# Amazon Rekognition client
rekognition = boto3.client("rekognition")


# Create a collection if it doesn't exist
# rekognition.create_collection(CollectionId=COLLECTION_ID)

# Call Amazon Rekognition
response = rekognition.index_faces(
    CollectionId=COLLECTION_ID,
    Image={
        "Bytes": imageBytes,
    },
    ExternalImageId=EXTERNAL_IMAGE_ID,
    MaxFaces=1,
    QualityFilter="HIGH",
)

# print(response)

with open("index-faces.json", "w") as f:
    f.write(json.dumps(response))