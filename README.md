# Anigram

## Database Schema Design

![Anigram-api-schema]

[Anigram-api-schema]: ./static/Screenshot%202025-02-19%20at%206.07.26 PM.png

## API Documentation

## USER AUTHENTICATION/AUTHORIZATION

### All endpoints that require authentication

All endpoints that require a current user to be logged in.

- Request: endpoints that require authentication
- Error Response: Require authentication

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Authentication required"
    }
    ```

### All endpoints that require proper authorization

All endpoints that require authentication and the current user does not have the
correct role(s) or permission(s).

- Request: endpoints that require proper authorization
- Error Response: Require proper authorization

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Forbidden"
    }
    ```

### Get the Current User

Returns the information about the current user that is logged in.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /api/session
  - Body: none

- Successful Response when there is a logged in user

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

- Successful Response when there is no logged in user

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": null
    }
    ```

### Log In a User

Logs in a current user with valid credentials and returns the current user's
information.

- Require Authentication: false
- Request

  - Method: POST
  - Route path: /api/session
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "credential": "john.smith@gmail.com",
      "password": "secret password"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

- Error Response: Invalid credentials

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Invalid credentials"
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "credential": "Email or username is required",
        "password": "Password is required"
      }
    }
    ```

### Sign Up a User

Creates a new user, logs them in as the current user, and returns the current
user's information.

- Require Authentication: false
- Request

  - Method: POST
  - Route path: /api/users
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@gmail.com",
      "username": "JohnSmith",
      "password": "secret password"
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

- Error response: User already exists with the specified email or username

  - Status Code: 500
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User already exists",
      "errors": {
        "email": "User with that email already exists",
        "username": "User with that username already exists"
      }
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "email": "Invalid email",
        "username": "Username is required",
        "firstName": "First Name is required",
        "lastName": "Last Name is required"
      }
    }
    ```

## Follows

### Get the current user's followers

Returns the current user's followers list.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /api/:userId/followers
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "User":{
         "id": 1,
         "username": "demo"
      },
      "Followers": [
        {
          "id": 1,
          "username": "Demo",
        },
        {
          "id": 1,
          "username": "marnie",
        },
        {
          "id": 1,
          "username": "bobbie",
        },
      ],
    }
    ```


### GET the current users following list

Returns the current user's following list.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /api/:userId/following
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

   ```json
    {
      "User":{
         "id": 1,
         "username": "demo"
      },
      "Following": [
        {
          "id": 1,
          "username": "Demo",
        },
        {
          "id": 1,
          "username": "marnie",
        },
        {
          "id": 1,
          "username": "bobbie",
        },
      ],
    }
    ```

## Watchlist

Returns the watchlist of the current user by name

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /api/:userId/watchlists/:watchlistId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "user_id": 1,
      "name": "watched",
      "anime": [
         {
            "title": "Attack on Titan",
            "image": "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
            "status": "Watching"
         },
         {
            "title": "Demon Slayer: Kimetsu no Yaiba",
            "image": "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
            "status": "Finished"
         },
      ],
    }
    ```

- Error response: Couldn't find an anime with the specified name

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Watchlist couldn't be found"
    }
    ```

## Anime

Returns the anime detail page.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /api/anime/:animeId
  - Headers:
    - Content-Type: application/json
  - Body:

    none

- Successful Response - redirect the user to the stock detail page

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
       ```json
    {
      "id": 1,
      "user_id": ,
      "watchlist_id": 1,
      "likes": 40,
      "title": "Attack on Titan",
      "image_url": "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg",
      "rating": 9.8,
      "synopsis": "Ever since the death of his father, the burden of supporting the family has fallen upon Tanjirou Kamado's shoulders. Though living impoverished on a remote mountain, the Kamado family are able to enjoy a relatively peaceful and happy life. One day, Tanjirou decides to go down to the local village to make a little money selling charcoal. On his way back, night falls, forcing Tanjirou to take shelter in the house of a strange man, who warns him of the existence of flesh-eating demons that lurk in the woods at night.

      When he finally arrives back home the next day, he is met with a horrifying sight—his whole family has been slaughtered. Worse still, the sole survivor is his sister Nezuko, who has been turned into a bloodthirsty demon. Consumed by rage and hatred, Tanjirou swears to avenge his family and stay by his only remaining sibling. Alongside the mysterious group calling themselves the Demon Slayer Corps, Tanjirou will do whatever it takes to slay the demons and protect the remnants of his beloved sister's humanity.

      [Written by MAL Rewrite]",
      "score": 8.2,
      "duration": "24 min per ep",
      "trailer": "https://www.youtube.com/watch?v=6vMuWuWlW4I",
      "mal_url": "https://myanimelist.net/anime/25777/Shingeki_no_Kyojin_Season_2",
      "mal_id": 25777,
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "anime_name": "Anime not found",
      }
    }
    ```


## Search

Searches for an anime and returns it

- Require Authentication: true
- Request

  - Method: POST
  - Route path: /api/search/:animeName --- Ex: /api/search/Attack%20on%20Titan
  - Headers:
    - Content-Type: application/json
  - Body:

     ```json
    {
      "anime": "Bleach",
    }
    ```

- Successful Response - redirect the user to the stock detail page

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
      ```json
    {
      "data": [
         "API response returns multiple objects"
      ]
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json

    ---- EITHER SHARES OR DOLLARS MUST BE INPUT
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "anime_name": "Anime name is required",
      }
    }
    ```



<!-- ### Fund account with money 

Adds fake money to account

- Require Authentication: true
- Request

  - Method: PUT
  - Route path: /api/:userId/account/add
  - Headers:
    - Content-Type: application/json
  - Body:

     ```json
    {
      "id": 1,
      "dollar_amount": 500,

    }
    ```

- Successful Response - exit out of the modal and update user funds -- REDIRECT TO PORTFOLIO PAGE

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

      ```json
    {
      "id": 1,
      "account_balance": 500.00
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "money": "Funds must be greater than 0.",
      }
    }
    ```

### Remove money from account 

Creates and returns a new stock.

- Require Authentication: true
- Request

  - Method: PUT
  - Route path: /api/:userId/account/remove
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "dollar_amount": 500,
    }
    ```

- Successful Response - redirect the user to the portfolio page

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

     ```json
    {
      "id": 1,
      "account_balance": 0.00
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "money": "Cannot remove funds with $0 account balance",
      }
    }
    ``` -->


    ------
    ------
    ------
    ------
    ------
    ------
    ------

<!-- ### Add a 

Create and return a new image for a spot specified by id.

- Require Authentication: true
- Require proper authorization: Spot must belong to the current user
- Request

  - Method: POST
  - Route path: /api/spots/:spotId/images
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "url": "image url",
      "preview": true
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "url": "image url",
      "preview": true
    }
    ```

- Error response: Couldn't find a Spot with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Spot couldn't be found"
    }
    ```

### Edit a Spot

Updates and returns an existing spot.

- Require Authentication: true
- Require proper authorization: Spot must belong to the current user
- Request

  - Method: PUT
  - Route path: /api/spots/:spotId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "address": "123 Disney Lane",
      "city": "San Francisco",
      "state": "California",
      "country": "United States of America",
      "lat": 37.7645358,
      "lng": -122.4730327,
      "name": "App Academy",
      "description": "Place where web developers are created",
      "price": 123
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "ownerId": 1,
      "address": "123 Disney Lane",
      "city": "San Francisco",
      "state": "California",
      "country": "United States of America",
      "lat": 37.7645358,
      "lng": -122.4730327,
      "name": "App Academy",
      "description": "Place where web developers are created",
      "price": 123,
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-20 10:06:40"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "address": "Street address is required",
        "city": "City is required",
        "state": "State is required",
        "country": "Country is required",
        "lat": "Latitude must be within -90 and 90",
        "lng": "Longitude must be within -180 and 180",
        "name": "Name must be less than 50 characters",
        "description": "Description is required",
        "price": "Price per day must be a positive number"
      }
    }
    ```

- Error response: Couldn't find a Spot with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Spot couldn't be found"
    }
    ```

### Delete a Spot

Deletes an existing spot.

- Require Authentication: true
- Require proper authorization: Spot must belong to the current user
- Request

  - Method: DELETE
  - Route path: /api/spots/:spotId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find a Spot with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Spot couldn't be found"
    }
    ```

## REVIEWS

### Get all Reviews of the Current User

Returns all the reviews written by the current user.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /api/reviews/current
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Reviews": [
        {
          "id": 1,
          "userId": 1,
          "spotId": 1,
          "review": "This was an awesome spot!",
          "stars": 5,
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "User": {
            "id": 1,
            "firstName": "John",
            "lastName": "Smith"
          },
          "Spot": {
            "id": 1,
            "ownerId": 1,
            "address": "123 Disney Lane",
            "city": "San Francisco",
            "state": "California",
            "country": "United States of America",
            "lat": 37.7645358,
            "lng": -122.4730327,
            "name": "App Academy",
            "price": 123,
            "previewImage": "image url"
          },
          "ReviewImages": [
            {
              "id": 1,
              "url": "image url"
            }
          ]
        }
      ]
    }
    ```

### Get all Reviews by a Spot's id

Returns all the reviews that belong to a spot specified by id.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /api/spots/:spotId/reviews
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Reviews": [
        {
          "id": 1,
          "userId": 1,
          "spotId": 1,
          "review": "This was an awesome spot!",
          "stars": 5,
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "User": {
            "id": 1,
            "firstName": "John",
            "lastName": "Smith"
          },
          "ReviewImages": [
            {
              "id": 1,
              "url": "image url"
            }
          ]
        }
      ]
    }
    ```

- Error response: Couldn't find a Spot with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Spot couldn't be found"
    }
    ```

### Create a Review for a Spot based on the Spot's id

Create and return a new review for a spot specified by id.

- Require Authentication: true
- Request

  - Method: POST
  - Route path: /api/spots/:spotId/reviews
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "review": "This was an awesome spot!",
      "stars": 5
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "userId": 1,
      "spotId": 1,
      "review": "This was an awesome spot!",
      "stars": 5,
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "review": "Review text is required",
        "stars": "Stars must be an integer from 1 to 5"
      }
    }
    ```

- Error response: Couldn't find a Spot with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Spot couldn't be found"
    }
    ```

- Error response: Review from the current user already exists for the Spot

  - Status Code: 500
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User already has a review for this spot"
    }
    ```

### Add an Image to a Review based on the Review's id

Create and return a new image for a review specified by id.

- Require Authentication: true
- Require proper authorization: Review must belong to the current user
- Request

  - Method: POST
  - Route path: /api/reviews/:reviewId/images
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "url": "image url"
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "url": "image url"
    }
    ```

- Error response: Couldn't find a Review with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Review couldn't be found"
    }
    ```

- Error response: Cannot add any more images because there is a maximum of 10
  images per resource

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Maximum number of images for this resource was reached"
    }
    ```

### Edit a Review

Update and return an existing review.

- Require Authentication: true
- Require proper authorization: Review must belong to the current user
- Request

  - Method: PUT
  - Route path: /api/reviews/:reviewId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "review": "This was an awesome spot!",
      "stars": 5
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "userId": 1,
      "spotId": 1,
      "review": "This was an awesome spot!",
      "stars": 5,
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-20 10:06:40"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "review": "Review text is required",
        "stars": "Stars must be an integer from 1 to 5"
      }
    }
    ```

- Error response: Couldn't find a Review with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Review couldn't be found"
    }
    ```

### Delete a Review

Delete an existing review.

- Require Authentication: true
- Require proper authorization: Review must belong to the current user
- Request

  - Method: DELETE
  - Route path: /api/reviews/:reviewId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find a Review with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Review couldn't be found"
    }
    ```

## BOOKINGS

### Get all of the Current User's Bookings

Return all the bookings that the current user has made.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /api/bookings/current
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Bookings": [
        {
          "id": 1,
          "spotId": 1,
          "Spot": {
            "id": 1,
            "ownerId": 1,
            "address": "123 Disney Lane",
            "city": "San Francisco",
            "state": "California",
            "country": "United States of America",
            "lat": 37.7645358,
            "lng": -122.4730327,
            "name": "App Academy",
            "price": 123,
            "previewImage": "image url"
          },
          "userId": 2,
          "startDate": "2021-11-19",
          "endDate": "2021-11-20",
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36"
        }
      ]
    }
    ```

### Get all Bookings for a Spot based on the Spot's id

Return all the bookings for a spot specified by id.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /api/spots/:spotId/bookings
  - Body: none

- Successful Response: If you ARE NOT the owner of the spot.

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Bookings": [
        {
          "spotId": 1,
          "startDate": "2021-11-19",
          "endDate": "2021-11-20"
        }
      ]
    }
    ```

- Successful Response: If you ARE the owner of the spot.

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Bookings": [
        {
          "User": {
            "id": 2,
            "firstName": "John",
            "lastName": "Smith"
          },
          "id": 1,
          "spotId": 1,
          "userId": 2,
          "startDate": "2021-11-19",
          "endDate": "2021-11-20",
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36"
        }
      ]
    }
    ```

- Error response: Couldn't find a Spot with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Spot couldn't be found"
    }
    ```

### Create a Booking from a Spot based on the Spot's id

Create and return a new booking from a spot specified by id.

- Require Authentication: true
- Require proper authorization: Spot must NOT belong to the current user
- Request

  - Method: POST
  - Route path: /api/spots/:spotId/bookings
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "startDate": "2021-11-19",
      "endDate": "2021-11-20"
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "spotId": 1,
      "userId": 2,
      "startDate": "2021-11-19",
      "endDate": "2021-11-20",
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36"
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "startDate": "startDate cannot be in the past",
        "endDate": "endDate cannot be on or before startDate"
      }
    }
    ```

- Error response: Couldn't find a Spot with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Spot couldn't be found"
    }
    ```

- Error response: Booking conflict

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Sorry, this spot is already booked for the specified dates",
      "errors": {
        "startDate": "Start date conflicts with an existing booking",
        "endDate": "End date conflicts with an existing booking"
      }
    }
    ```

### Edit a Booking

Update and return an existing booking.

- Require Authentication: true
- Require proper authorization: Booking must belong to the current user
- Request

  - Method: PUT
  - Route path: /api/bookings/:bookingId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "startDate": "2021-11-19",
      "endDate": "2021-11-20"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "spotId": 1,
      "userId": 2,
      "startDate": "2021-11-19",
      "endDate": "2021-11-20",
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-20 10:06:40"
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "startDate": "startDate cannot be in the past",
        "endDate": "endDate cannot be on or before startDate"
      }
    }
    ```

- Error response: Couldn't find a Booking with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Booking couldn't be found"
    }
    ```

- Error response: Can't edit a booking that's past the end date

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Past bookings can't be modified"
    }
    ```

- Error response: Booking conflict

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Sorry, this spot is already booked for the specified dates",
      "errors": {
        "startDate": "Start date conflicts with an existing booking",
        "endDate": "End date conflicts with an existing booking"
      }
    }
    ```

### Delete a Booking

Delete an existing booking.

- Require Authentication: true
- Require proper authorization: Booking must belong to the current user or the
  Spot must belong to the current user
- Request

  - Method: DELETE
  - Route path: /api/bookings/:bookingId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find a Booking with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Booking couldn't be found"
    }
    ```

- Error response: Bookings that have been started can't be deleted

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bookings that have been started can't be deleted"
    }
    ```

## IMAGES

### Delete a Spot Image

Delete an existing image for a Spot.

- Require Authentication: true
- Require proper authorization: Spot must belong to the current user
- Request

  - Method: DELETE
  - Route path: /api/spot-images/:imageId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find a Spot Image with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Spot Image couldn't be found"
    }
    ```

### Delete a Review Image

Delete an existing image for a Review.

- Require Authentication: true
- Require proper authorization: Review must belong to the current user
- Request

  - Method: DELETE
  - Route path: /api/review-images/:imageId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find a Review Image with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Review Image couldn't be found"
    }
    ```

## Add Query Filters to Get All Spots

Return spots filtered by query parameters.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /api/spots
  - Query Parameters
    - page: integer, minimum: 1, default: 1
    - size: integer, minimum: 1, maximum: 20, default: 20
    - minLat: decimal, optional
    - maxLat: decimal, optional
    - minLng: decimal, optional
    - maxLng: decimal, optional
    - minPrice: decimal, optional, minimum: 0
    - maxPrice: decimal, optional, minimum: 0
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Spots": [
        {
          "id": 1,
          "ownerId": 1,
          "address": "123 Disney Lane",
          "city": "San Francisco",
          "state": "California",
          "country": "United States of America",
          "lat": 37.7645358,
          "lng": -122.4730327,
          "name": "App Academy",
          "description": "Place where web developers are created",
          "price": 123,
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "avgRating": 4.5,
          "previewImage": "image url"
        }
      ],
      "page": 2,
      "size": 20
    }
    ```

- Error Response: Query parameter validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "page": "Page must be greater than or equal to 1",
        "size": "Size must be between 1 and 20",
        "maxLat": "Maximum latitude is invalid",
        "minLat": "Minimum latitude is invalid",
        "minLng": "Maximum longitude is invalid",
        "maxLng": "Minimum longitude is invalid",
        "minPrice": "Minimum price must be greater than or equal to 0",
        "maxPrice": "Maximum price must be greater than or equal to 0"
      }
    }
    ``` -->