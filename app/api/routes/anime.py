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

@anime.route('/<string:animeName>/load', methods=['GET','POST'])
@login_required
def add_anime(animeName):
    """
    Search for anime through Jikan API by name and return an obj of that anime
    # if the anime exists, return that anime object as a dict
    """
    anime_info = request.get_json()

    response = Anime.query.filter(Anime.title == anime_info['title_english']).all()

    print('             RESPONSE HERE FROM ANIME BACKEND   !!!!!!!!!   ', response)

    if response:
        print('   THE ANIME EXISTS FROM ANIME BACKEND   ===>    ', response)
        return jsonify(response[0].to_dict())
    else:
        name = '%20'.join(anime_info['title_english'].split(' '))
        # anime_response = requests.get(f'https://api.jikan.moe/v4/anime?q={name}&limit=1&page=1')

        # anime_data = anime_response.json()
    

        anime_obj = Anime(
            mal_id=anime_info['mal_id'],
            watchlist_id= None,
            likes=0,
            title=anime_info['title_english'],
            image_url=anime_info['images']['jpg']['large_image_url'],
            producers=anime_info['producers'][0]['name'] if anime_info['producers'] and anime_info['producers'][0] else None,
            rating=anime_info['rating'],
            trailer_url= anime_info['trailer']['url'] or None,
            mal_url= anime_info['url'],
            synopsis= anime_info['synopsis'],
        )

        db.session.add(anime_obj)
        db.session.commit()
        # first, modify the db table fields to hold correct data -- #* DONE
        # DELETE the migration and remigrate #*DONE
        # if the anime doesnt exist in db, grab the info and put it in an object
        # add and commit to the session

        return jsonify(anime_obj.to_dict())
    



@anime.route('/load/all', methods=['GET'])
@login_required
def populate_anime():
    all_anime = Anime.query.all()
    print('                 !!!!!!!!!      This is all Anime      ', all_anime)
    return jsonify({f'anime_{anime.mal_id}': anime.to_dict() for anime in all_anime})