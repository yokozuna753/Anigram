from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models.anime import Anime
from app.models import db
import requests

anime = Blueprint('anime', __name__)

# 1. receive a request from the frontend for an anime
    # - request will have anime name in the url
# 2. fetch the anime info by the name to Jikan API
# 3. receive the response
    # - add the anime to the db if doesnt exist
    # - format the information as per the README
# 4. send response back as json

@anime.route('/<string:animeName>', methods=['GET','POST'])
@login_required
def search_anime(animeName):
    """
    Search for anime through Jikan API by name and return an obj of that anime
    """
    anime_info = request.get_json()
    print('     ANIME NAME', animeName)
    response = Anime.query.filter(Anime.title == anime_info['title_english']).all()
    print('            RESPONSE HERE !!!!!!   ', response)
    if response:
        print('         WE MADE ITTTTT       !!!!!!!!!')
    else:
        name = '%20'.join(anime_info['title_english'].split(' '))
        anime_response = requests.get(f'https://api.jikan.moe/v4/anime?q={name}&limit=1&page=1')

        anime_data = anime_response.json()
    
        print('          !!!! THIS IS THE ANIME =====>   ', anime_data['data'])

        # ! first, modify the db table fields to hold correct data
        #! DELETE the migration and remigrate
        # if the anime doesnt exist in db, grab the info and put it in an object
        # add and commit to the session

    
    return jsonify({'message': 'test'})