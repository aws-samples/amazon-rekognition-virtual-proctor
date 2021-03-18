import boto3
import json

# Image
imageName = "media/face.png"

# Read image content
with open(imageName, "rb") as document:
    imageBytes = bytearray(document.read())

# Amazon Rekognition client
rekognition = boto3.client("rekognition")

# Call Amazon Rekognition
response = rekognition.detect_faces(
    Image={"Bytes": imageBytes},
)

# print(response)

with open("detect-faces.json", "w") as f:
    f.write(json.dumps(response))
