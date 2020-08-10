# 

## if you want to connect mongoDB via shell
mongo "mongodb+srv://silver_bullet_user:HnJH6pq4rlFJFGiq@cluster0.vh7h9.gcp.mongodb.net/silverbullet?retryWrites=true&w=majority"

cd GroupProject_Segfault_API

mongo "mongodb+srv://silver_bullet_user:HnJH6pq4rlFJFGiq@cluster0.vh7h9.gcp.mongodb.net/silverbullet?retryWrites=true&w=majority" scripts/init.mongo.js

mongo "mongodb+srv://silver_bullet_user:HnJH6pq4rlFJFGiq@cluster0.vh7h9.gcp.mongodb.net/silverbullet?retryWrites=true&w=majority" scripts/generate_data.mongo.js


heroku create silverbullet-api-segfault


heroku config:set \
DB_URL=mongodb+srv://issue_tracker_user:SjkK3Smm53Ik4kZe@cluster0.vh7h9.gcp.mongodb.net/issuetracker?retryWrites=true \
JWT_SECRET=xyfEzRdDKm \
COOKIE_DOMAIN=herokuapp.com


heroku config:set COOKIE_DOMAIN=silverbullet-ui-segfault.herokuapp.com

heroku create silverbullet-ui-segfault

heroku config:set \
UI_API_ENDPOINT=https://silverbullet-api-segfault.herokuapp.com/graphql \
UI_AUTH_ENDPOINT=https://silverbullet-api-segfault.herokuapp.com/auth \
GOOGLE_CLIENT_ID=14882429343-uj99brhrjilm9a1agj0ljot2pi8q9o28.apps.googleusercontent.com

heroku config:set \
UI_SERVER_ORIGIN=https://silverbullet-ui-segfault.herokuapp.com



### proxy mode
cd tracker-ui

heroku config:set \
UI_API_ENDPOINT=https://silverbullet-ui-segfault.herokuapp.com/graphql \
UI_AUTH_ENDPOINT=https://silverbullet-ui-segfault.herokuapp.com/auth \
UI_SERVER_API_ENDPOINT=https://silverbullet-api-segfault.herokuapp.com/graphql \
API_PROXY_TARGET=https://silverbullet-api-segfault.herokuapp.com



heroku config:set \
GOOGLE_CLIENT_ID=14882429343-eco73nemee2g4oqvi43282on4ljnc3b0.apps.googleusercontent.com




## mongoDB
db.backlog.aggregate([
  {
    $lookup:
      {
        from: "dashboard.find(title = value)",
        localField: "dashboardId",
        foreignField: "id",
        as: "dashboard_docs"
      }
  }
])

