# 
cd GroupProject_Segfault_API

mongo "mongodb+srv://silver_bullet_user:HnJH6pq4rlFJFGiq@cluster0.vh7h9.gcp.mongodb.net/silverbullet?retryWrites=true&w=majority" scripts/init.mongo.js

mongo "mongodb+srv://silver_bullet_user:HnJH6pq4rlFJFGiq@cluster0.vh7h9.gcp.mongodb.net/silverbullet?retryWrites=true&w=majority" scripts/generate_data.mongo.js


