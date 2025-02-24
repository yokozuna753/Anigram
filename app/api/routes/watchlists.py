from flask import Blueprint, jsonify
from flask_login import login_required
from app.models.watchlist import Watchlist
from app.models import db

watchlists = Blueprint('watchlists', __name__)



@watchlists.route('/<int:userId>/<int:watchlistId>/<string:animeName>')
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
                "title": anime.title,
                "image_url": anime.image_url,
                "rating": anime.rating,
                "likes": anime.likes,
                "watchlist_id": anime.watchlist_id
            } for anime in watchlist.anime]
        }
        watchlists_data.append(watchlist_data)
    
    print('           FINAL WATCHLISTS HERE WITHOUT ANIME ====>   ', watchlists_data)
    
    return jsonify(watchlists_data)



@watchlists.route('/<int:userId>/load')
@login_required
def load_anime(userId):
    watchlists = Watchlist.query.filter(Watchlist.user_id == int(userId)).all()
    print('IN BACKEND WATCHLIST ===> \n', watchlists)
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
                "title": anime.title,
                "image_url": anime.image_url,
                "rating": anime.rating,
                "likes": anime.likes,
                "watchlist_id": anime.watchlist_id
            } for anime in watchlist.anime]
        }
    watchlists_data.append(watchlist_data)
    
    return jsonify(watchlists_data)