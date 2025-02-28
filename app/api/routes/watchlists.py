from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models.watchlist import Watchlist
from app.models.anime import Anime
from app.models import db


watchlists = Blueprint('watchlists', __name__)



@watchlists.route('/<int:userId>/<int:watchlistId>/<string:animeName>',methods=['DELETE'])
@login_required
def remove_anime(userId, watchlistId, animeName):
    """
    DELETE an anime from a specific watchlist and return the updated watchlists
    """
    watchlist = Watchlist.query.filter(Watchlist.user_id == int(userId), Watchlist.id == int(watchlistId)).first()
    
    foundWatchlist = None
    foundAnime = None
    
    # Find the specific watchlist

    if watchlist.id == watchlistId:
        foundWatchlist = watchlist
    
    if not foundWatchlist:
        return jsonify({"error": "Watchlist not found"}), 404
        
    # Find and delete the anime
    for item in foundWatchlist.anime:
        if item.title == animeName:
            foundAnime = item
            db.session.delete(foundAnime)
            break
            
    if not foundAnime:
        return jsonify({"error": "Anime not found in the watchlist"}), 404

    db.session.commit()

    watchlists = Watchlist.query.filter(Watchlist.id == int(watchlistId)).all()
    
    # Return serialized watchlists data
    watchlists_data = []
    for watchlist in watchlists:
        watchlist_data = {
            "id": watchlist.id,
            "user_id": watchlist.user_id,
            "name": watchlist.name,
            "created_at": watchlist.created_at.isoformat() if watchlist.created_at else None,
            "updated_at": watchlist.updated_at.isoformat() if watchlist.updated_at else None,
            "anime": [{
                "id": anime.id,
                "image_url": anime.image_url,
                "likes": anime.likes,
                "mal_id": anime.mal_id,
                "mal_url": anime.mal_url,
                "producers": anime.producers,
                "rating": anime.rating,
                "synopsis": anime.synopsis,
                "title": anime.title,
                "trailer_url": anime.trailer_url,
                "watchlist_id": anime.watchlist_id
            } for anime in watchlist.anime]
        }
        watchlists_data.append(watchlist_data)
    
    return jsonify(watchlists_data)





@watchlists.route('/<int:userId>/<int:watchlistId>/<string:animeName>/add', methods=['POST'])
@login_required
def add_anime(userId, watchlistId, animeName):
    """
    ADD an anime to a watchlist and return the updated watchlists
    """
    request_data = request.get_json()
    anime_obj = request_data.get('anime_obj')
    
    # Verify the route parameters match the request data
    if int(userId) != request_data.get('userId') or int(watchlistId) != request_data.get('watchlistId'):
        return jsonify({"error": "Route parameters don't match request data"}), 400
    
    # Find the watchlist
    watchlist = Watchlist.query.filter(
        Watchlist.user_id == int(userId), 
        Watchlist.id == int(watchlistId)
    ).first()
    
    # Make sure the watchlist exists
    if not watchlist:
        return jsonify({"error": "Watchlist not found"}), 404
    
    # Check if the anime already exists in the database for this watchlist
    existing_anime = Anime.query.filter(
        Anime.mal_id == anime_obj.get('mal_id'),
        Anime.watchlist_id == watchlistId
    ).first()
    
    if existing_anime:
        # Anime already in this watchlist
        return jsonify({"error": "Anime already in watchlist"}), 400
    
    # Create a new Anime entry and add it to the watchlist
    new_anime = Anime(
        mal_id=anime_obj.get('mal_id'),
        watchlist_id=watchlistId,
        likes=anime_obj.get('likes', 0),
        title=anime_obj.get('title'),
        image_url=anime_obj.get('image_url'),
        producers=anime_obj.get('producers'),
        rating=anime_obj.get('rating'),
        trailer_url=anime_obj.get('trailer_url'),
        mal_url=anime_obj.get('mal_url'),
        synopsis=anime_obj.get('synopsis')
    )
    
    db.session.add(new_anime)
    db.session.commit()
    
    # Get all watchlists for the user to return
    user_watchlists = Watchlist.query.filter(Watchlist.user_id == int(userId)).all()
    
    return jsonify([watchlist.to_dict() for watchlist in user_watchlists])





@watchlists.route('/<int:userId>/load', methods=['GET'])
@login_required
def load_anime(userId):
    """
    GET the watchlists and return them
    """
    watchlists = Watchlist.query.filter(Watchlist.user_id == int(userId)).all()
    watchlists_data = []
    for watchlist in watchlists:
        watchlist_data = {
            "id": watchlist.id,
            "user_id": watchlist.user_id,
            "name": watchlist.name,
            "created_at": watchlist.created_at.isoformat() if watchlist.created_at else None,
            "updated_at": watchlist.updated_at.isoformat() if watchlist.updated_at else None,
            "anime": [{
                 "id": anime.id,
                "image_url": anime.image_url,
                "likes": anime.likes,
                "mal_id": anime.mal_id,
                "mal_url": anime.mal_url,
                "producers": anime.producers,
                "rating": anime.rating,
                "synopsis": anime.synopsis,
                "title": anime.title,
                "trailer_url": anime.trailer_url,
                "watchlist_id": anime.watchlist_id
            } for anime in watchlist.anime]
        }

        watchlists_data.append(watchlist_data)
    
    return jsonify(watchlists_data)