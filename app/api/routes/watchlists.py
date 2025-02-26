from flask import Blueprint, jsonify
from flask_login import login_required
from app.models.watchlist import Watchlist
from app.models import db

watchlists = Blueprint('watchlists', __name__)



@watchlists.route('/<int:userId>/<int:watchlistId>/<string:animeName>',methods=['DELETE'])
@login_required
def remove_anime(userId, watchlistId, animeName):
    """
    Delete an anime from a specific watchlist and return the updated watchlists
    """
    watchlists = Watchlist.query.filter(Watchlist.user_id == int(userId)).all()
    
    foundWatchlist = None
    foundAnime = None
    
    # Find the specific watchlist
    for watchlist in watchlists:
        if watchlist.id == watchlistId:
            foundWatchlist = watchlist
            break
    
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


@watchlists.route('/<int:userId>/<int:watchlistId>/<string:animeName>/add',methods=['POST'])
@login_required
def add_anime(userId, watchlistId, animeName):
    """
    ADD an anime to a watchlist and return the updated watchlists
    """
    watchlists = Watchlist.query.filter(Watchlist.user_id == int(userId) and Watchlist.id == int(watchlistId)).all()
    
    foundWatchlist = None
    foundAnime = None
    
    # Find the specific watchlist
    for watchlist in watchlists:
        if watchlist.id == watchlistId:
            foundWatchlist = watchlist
            break
    
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





@watchlists.route('/<int:userId>/load')
@login_required
def load_anime(userId):
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