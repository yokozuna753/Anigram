from app.models import db, environment, SCHEMA
from app.models.anime import Anime
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_anime():
    attack_on_titan = Anime(
        mal_id=16498,
        watchlist_id=1,
        likes=0,
        title="Attack on Titan",
        image_url="https://cdn.myanimelist.net/images/anime/10/47347l.jpg",
        producers="Production I.G",
        rating="R - 17+ (violence & profanity)",
        trailer_url="https://www.youtube.com/watch?v=LHtdKWJdif4",
        mal_url="https://myanimelist.net/anime/16498/Shingeki_no_Kyojin",
        synopsis="""Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans, forcing humans to hide in fear behind enormous concentric walls. What makes these giants truly terrifying is that their taste for human flesh is not born out of hunger but what appears to be out of pleasure. To ensure their survival, the remnants of humanity began living within defensive barriers, resulting in one hundred years without a single titan encounter. However, that fragile calm is soon shattered when a colossal Titan manages to breach the supposedly impregnable outer wall, reigniting the fight for survival against the man-eating abominations.
After witnessing a horrific personal loss at the hands of the invading creatures, Eren Yeager dedicates his life to their eradication by enlisting into the Survey Corps, an elite military unit that combats the merciless humanoids outside the protection of the walls. Eren, his adopted sister Mikasa Ackerman, and his childhood friend Armin Arlert join the brutal war against the Titans and race to discover a way of defeating them before the last walls are breached.
""",
    )
    demon_slayer = Anime(
        mal_id=38000,
        watchlist_id=1,
        likes=0,
        title="Demon Slayer: Kimetsu no Yaiba",
        image_url="https://cdn.myanimelist.net/images/anime/1286/99889l.jpg",
        producers="Aniplex",
        rating="R - 17+ (violence & profanity)",
        trailer_url="https://www.youtube.com/watch?v=6vMuWuWlW4I",
        mal_url="https://myanimelist.net/anime/38000/Kimetsu_no_Yaiba",
        synopsis="""Ever since the death of his father, the burden of supporting the family has fallen upon Tanjirou Kamado's shoulders. Though living impoverished on a remote mountain, the Kamado family are able to enjoy a relatively peaceful and happy life. One day, Tanjirou decides to go down to the local village to make a little money selling charcoal. On his way back, night falls, forcing Tanjirou to take shelter in the house of a strange man, who warns him of the existence of flesh-eating demons that lurk in the woods at night.
When he finally arrives back home the next day, he is met with a horrifying sight—his whole family has been slaughtered. Worse still, the sole survivor is his sister Nezuko, who has been turned into a bloodthirsty demon. Consumed by rage and hatred, Tanjirou swears to avenge his family and stay by his only remaining sibling. Alongside the mysterious group calling themselves the Demon Slayer Corps, Tanjirou will do whatever it takes to slay the demons and protect the remnants of his beloved sister's humanity.
""",
    )

    one_piece = Anime(
        mal_id=21,
        watchlist_id=5,
        likes=0,
        title="One Piece",
        image_url="https://cdn.myanimelist.net/images/anime/1244/138851l.jpg",
        producers="Fuji TV",
        rating="PG-13 - Teens 13 or older",
        trailer_url="https://www.youtube.com/watch?v=-tviZNY6CSw",
        mal_url="https://myanimelist.net/anime/21/One_Piece",
        synopsis="""Barely surviving in a barrel after passing through a terrible whirlpool at sea, carefree Monkey D. Luffy ends up aboard a ship under attack by fearsome pirates. Despite being a naive-looking teenager, he is not to be underestimated. Unmatched in battle, Luffy is a pirate himself who resolutely pursues the coveted One Piece treasure and the King of the Pirates title that comes with it.
The late King of the Pirates, Gol D. Roger, stirred up the world before his death by disclosing the whereabouts of his hoard of riches and daring everyone to obtain it. Ever since then, countless powerful pirates have sailed dangerous seas for the prized One Piece only to never return. Although Luffy lacks a crew and a proper ship, he is endowed with a superhuman ability and an unbreakable spirit that make him not only a formidable adversary but also an inspiration to many.
As he faces numerous challenges with a big smile on his face, Luffy gathers one-of-a-kind companions to join him in his ambitious endeavor, together embracing perils and wonders on their once-in-a-lifetime adventure.
""",
    )

    demon_slayer2 = Anime(
        mal_id=38000,
        watchlist_id=6,
        likes=0,
        title="Demon Slayer: Kimetsu no Yaiba",
        image_url="https://cdn.myanimelist.net/images/anime/1286/99889l.jpg",
        producers="Aniplex",
        rating="R - 17+ (violence & profanity)",
        trailer_url="https://www.youtube.com/watch?v=6vMuWuWlW4I",
        mal_url="https://myanimelist.net/anime/38000/Kimetsu_no_Yaiba",
        synopsis="""Ever since the death of his father, the burden of supporting the family has fallen upon Tanjirou Kamado's shoulders. Though living impoverished on a remote mountain, the Kamado family are able to enjoy a relatively peaceful and happy life. One day, Tanjirou decides to go down to the local village to make a little money selling charcoal. On his way back, night falls, forcing Tanjirou to take shelter in the house of a strange man, who warns him of the existence of flesh-eating demons that lurk in the woods at night.
When he finally arrives back home the next day, he is met with a horrifying sight—his whole family has been slaughtered. Worse still, the sole survivor is his sister Nezuko, who has been turned into a bloodthirsty demon. Consumed by rage and hatred, Tanjirou swears to avenge his family and stay by his only remaining sibling. Alongside the mysterious group calling themselves the Demon Slayer Corps, Tanjirou will do whatever it takes to slay the demons and protect the remnants of his beloved sister's humanity.
""",
    )

    one_piece2 = Anime(
        mal_id=21,
        watchlist_id=9,
        likes=0,
        title="One Piece",
        image_url="https://cdn.myanimelist.net/images/anime/1244/138851l.jpg",
        producers="Fuji TV",
        rating="PG-13 - Teens 13 or older",
        trailer_url="https://www.youtube.com/watch?v=-tviZNY6CSw",
        mal_url="https://myanimelist.net/anime/21/One_Piece",
        synopsis="""Barely surviving in a barrel after passing through a terrible whirlpool at sea, carefree Monkey D. Luffy ends up aboard a ship under attack by fearsome pirates. Despite being a naive-looking teenager, he is not to be underestimated. Unmatched in battle, Luffy is a pirate himself who resolutely pursues the coveted One Piece treasure and the King of the Pirates title that comes with it.
The late King of the Pirates, Gol D. Roger, stirred up the world before his death by disclosing the whereabouts of his hoard of riches and daring everyone to obtain it. Ever since then, countless powerful pirates have sailed dangerous seas for the prized One Piece only to never return. Although Luffy lacks a crew and a proper ship, he is endowed with a superhuman ability and an unbreakable spirit that make him not only a formidable adversary but also an inspiration to many.
As he faces numerous challenges with a big smile on his face, Luffy gathers one-of-a-kind companions to join him in his ambitious endeavor, together embracing perils and wonders on their once-in-a-lifetime adventure.
""",
    )

    db.session.add(attack_on_titan)
    db.session.add(demon_slayer)
    db.session.add(one_piece)
    db.session.add(demon_slayer2)
    db.session.add(one_piece2)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_anime():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.anime RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM anime"))

    db.session.commit()
