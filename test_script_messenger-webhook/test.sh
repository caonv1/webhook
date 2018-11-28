node index.js
YOUR_VERIFY_TOKEN="07XD2CmXlJeq5vYDpyYNXO8QB"
curl -X GET "localhost:1337/webhook?hub.verify_token=${YOUR_VERIFY_TOKEN}&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"



curl -H "Content-Type: application/json" -X POST "localhost:1337/webhook" -d '{"object": "page", "entry": [{"messaging": [{"message": "TEST_MESSAGE"}]}]}'