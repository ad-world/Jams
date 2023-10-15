
# Jams
Jams is a web application that allows users to create collaborative queues where their friends can join and request songs to play. It is similar to Spotify Jam, but only one person needs a Spotify account (the session host). It is a rebuild of my previous project called Music Sessions, but while that was built with Handlebars (templating) and JavaScript, this is built in React and TS. 




## Deployment

This app is deployed at https://jams-r63m.onrender.com/.
You need to be on a whitelist to access it (because Spotify sucks lol). I'm trying to get an API Quota extension (so that the app is publicly available) but I'm not hopeful.
Let me know if you'd like to be on the whitelist

## Usage

For local development, you will need the following things
- a MongoDB database, local or in the cloud (Atlas)
- a spotify developer account (and a spotify application)

Fill out your environment variables, run `npm install` and `npm run dev` and you should be good to go!



## Environment Variables

After cloning the repository, add these fields to your .env.local
```
CLIENT_ID="client ID from spotify"
CLIENT_SECRET="client secret from spotify"
SPOTIFY_API=https://api.spotify.com/v1
NEXTAUTH_SECRET="generate a secret for this"
MONGO_DB="mongo url"
DB_NAME="mongo collection"
NEXTAUTH_URL="http://localhost:3000"
```


## Features

- Creating a session 
- Joining a session
- Requesting songs as a listener
- Accepting / rejecting requests as a host
- Searching through Spotify's catalog
- Viewing your playlists (and adding songs to queue from there)
- Song playback control

## Tech Stack

- React
- Typescript
- Next.js
- MongoDB
- ChakraUI
- tRPC
- Spotify Web API


## Authors

- [@ad-world](https://www.github.com/ad-world)

