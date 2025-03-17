from flask import Blueprint, request, jsonify
from app.models import db, Image
from flask_login import current_user, login_required
from app.forms.image_form import ImageForm
from app.api.routes.aws_helpers import (
    upload_file_to_s3, get_unique_filename, remove_file_from_s3)

image_routes = Blueprint("images", __name__)


@image_routes.route("/<int:userId>/profile-pic/update", methods=["POST"])
@login_required
def upload_image(userId):
    '''
    Takes in a File object and uploads profile image to AWS
    '''
    if 'image' not in request.files:
        return {'errors': {'message': 'No image provided'}}, 400
        
    image = request.files['image']
    
    if image.filename == '':
        return {'errors': {'message': 'No image selected'}}, 400
    
    print('          !!!!!   IMAGE  ', image)

    # Create a unique filename
    unique_filename = get_unique_filename(image.filename)
    image.filename = unique_filename  # Set the filename correctly
    
    # Upload to S3
    upload = upload_file_to_s3(image)
    print('      !!!! UPLOAD: ', upload)
    
    if "errors" in upload:
        return {"errors": upload["errors"]}, 400

    # If successful, do whatever you need with the URL
    image_url = upload["url"]
    print('     !!!! IMAGE URL: ', image_url)
    if image_url:
        new_image = Image(user_id=userId, image_url=image_url)
        print('        !!!! NEW IMAGE====>  ', new_image)
        db.session.add(new_image)
        db.session.commit()
        return new_image.to_dict()

    return {'error': "failed in backend images route"}


@image_routes.route("/<int:userId>/profile-pic/remove", methods=["DELETE"])
@login_required
def remove_image(userId):
    '''
    Query the images table for image_url via a matching userId

    Delete image from table and AWS

    Returns a message if image successfully deleted
    '''
    # Make sure current user can only modify their own image
    if current_user.id != userId:
        return jsonify({"errors": {"message": "Unauthorized"}}), 403
        
    found_image = Image.query.filter(Image.user_id == userId).first()
    print('found image here !!!!!!!', found_image)
    
    if found_image:
        try:
            # First remove from S3 if needed
            if found_image.image_url:
                remove_file_from_s3(found_image.image_url)
                
            # Then remove from database
            db.session.delete(found_image)
            db.session.commit()
            return jsonify({"message": "Image successfully deleted"})
        except Exception as e:
            db.session.rollback()
            print(f"Error deleting image: {str(e)}")
            return jsonify({"errors": {"message": str(e)}}), 500
    else:
        return jsonify({"message": "No image found for this user"}), 404
    

@image_routes.route("/load/all", methods=['GET'])
@login_required
def get_all_images():
    all_images = Image.query.all()
    # for image in all_images: 
    #     print('THIS IS IMAGE ======!!!!  ', image.id, image.user_id, image.image_url)
    # print('             !!!!!!!!   ALL IMAGES ---------- !!!!  ',all_images)
    return {f"user_{image.user_id}":{'id':image.id, 'user_id': image.user_id,'image_url':image.image_url} 
            for image in all_images}