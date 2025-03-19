import os
import uuid

import boto3
import botocore

# BUCKET_NAME = os.environ.get("S3_BUCKET", "anigram-bucket")  # Set default value
BUCKET_NAME = "anigram-bucket"  # Set default value

print(f"Using bucket name: {BUCKET_NAME}")
# Add region - very important!
AWS_REGION = "us-east-1"  # Change this to your bucket's actual region
S3_LOCATION = f"https://{BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/"
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "gif"}

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.environ.get("S3_KEY"),
    aws_secret_access_key=os.environ.get("S3_SECRET"),
    region_name=AWS_REGION,  # Add the region here
)


def get_unique_filename(filename):
    ext = filename.rsplit(".", 1)[1].lower()
    unique_filename = uuid.uuid4().hex
    return f"{unique_filename}.{ext}"


def upload_file_to_s3(file, acl="public-read"):

    # Make s3 global so we can modify it
    global s3, AWS_REGION
    try:
        all_buckets = s3.list_buckets()
        print("Available buckets:", [b["Name"] for b in all_buckets.get("Buckets", [])])
    except Exception as e:
        print(f"Error listing buckets: {e}")

    # Try different regions if necessary
    try:
        response = s3.get_bucket_location(Bucket=BUCKET_NAME)
        actual_region = response["LocationConstraint"]
        if not actual_region:  # us-east-1 returns None
            actual_region = "us-east-1"
        print(f"Actual bucket region: {actual_region}")

        # Update region if necessary
        if actual_region != AWS_REGION:
            print(f"Region mismatch! Updating from {AWS_REGION} to {actual_region}")
            AWS_REGION = actual_region
            global S3_LOCATION
            S3_LOCATION = f"https://{BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/"
            s3 = boto3.client(
                "s3",
                aws_access_key_id=os.environ.get("S3_KEY"),
                aws_secret_access_key=os.environ.get("S3_SECRET"),
                region_name=AWS_REGION,
            )
    except Exception as e:
        print(f"Error getting bucket location: {e}")

    try:
        # Use the name attribute for the object key in S3
        file_name = file.filename if hasattr(file, "filename") else file.name

        # Add debugging
        print(f"Uploading to bucket: {BUCKET_NAME}")
        print(f"With region: {AWS_REGION}")
        print(f"With filename: {file_name}")

        s3.upload_fileobj(
            file,
            BUCKET_NAME,
            file_name,
            ExtraArgs={"ACL": acl, "ContentType": file.content_type},
        )
    except Exception as e:
        print(f"S3 upload error: {str(e)}")
        return {"errors": str(e)}

    return {"url": f"{S3_LOCATION}{file_name}"}


def remove_file_from_s3(image_url):
    # AWS needs the image file name, not the URL,
    # so you split that out of the URL
    key = image_url.rsplit("/", 1)[1]
    print(key)
    try:
        s3.delete_object(Bucket=BUCKET_NAME, Key=key)
    except Exception as e:
        return {"errors": str(e)}
    return True
