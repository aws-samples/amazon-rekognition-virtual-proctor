import boto3
import json

# Image
image1Name = "media/image1.png"
image2Name = "media/image2.png"

# Read image content
with open(image1Name, "rb") as document:
    image1Bytes = bytearray(document.read())

with open(image2Name, "rb") as document:
    image2Bytes = bytearray(document.read())

# Amazon Rekognition client
rekognition = boto3.client("rekognition")

# Call Amazon Rekognition
response = rekognition.compare_faces(
    SourceImage={
        "Bytes": image1Bytes,
    },
    TargetImage={
        "Bytes": image2Bytes,
    },
    SimilarityThreshold=90,
    QualityFilter="HIGH",
)

with open("compare-faces.json", "w") as f:
    f.write(json.dumps(response))