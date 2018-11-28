node index.js
YOUR_VERIFY_TOKEN="EAAIe5UWYjM8BAJw71k4zuqwn5OEZCrC3ZBdaOm5PnnAoXlFNxqb4szZBAuZC1TR3KNfUYKZCNaP7qZCk8eNFrTxFsMegZB6kFHRNqXXa6JZClQsZC7CD1IEsHrkWc4jcRIJo0fneGbZAsUVCcZBfkHX89DJUWC7YfjZAmYnmQoV9lZA2N5yvtZBZADpmdvS"
curl -X GET "localhost:1337/webhook?hub.verify_token=${YOUR_VERIFY_TOKEN}&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"



curl -H "Content-Type: application/json" -X POST "localhost:1337/webhook" -d '{"object": "page", "entry": [{"messaging": [{"message": "TEST_MESSAGE"}]}]}'