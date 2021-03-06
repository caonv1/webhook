'use strict';

//const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const PAGE_ACCESS_TOKEN="EAAE5iZATG9ZCUBAOvfsLncwtFQFvAd3VhwshYEVZBEacuC4T8FcPfVKvb6fHi9wIUvcLQXZCjtRBcNZBD3K1s9SteZA2aPT0WOPHGwqGSFmdsXqqhJPj3KUeJnv9SsQ2SFTZAlqTeKuZCT51l1qZBSB03iQ5SQ7ebiPZCdC76ZBno0tVQZDZD"

// Imports dependencies and set up http server
const
  	request = require('request'),
	express = require('express'),
 	bodyParser = require('body-parser'),
  	app = express().use(bodyParser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'))

// REST API
// Method: POST
// endpoint /webhook
app.post('/webhook', (req, res) => {
	let body = req.body;

	console.log('webhook POST Method');

	// check this is an event form a page subscription
	if (body.object == 'page') {

		// Iterates over each entry - there may be mutilple if batched
		body.entry.forEach(function(entry) {

			// Gets the message. entry.messaging is an array, but
			// will only ever contain one message, so get index 0
			let webhook_event = entry.messaging[0];
			console.log(webhook_event);
			// Get the sender PSID
  			let sender_psid = webhook_event.sender.id;
  			console.log('Sender PSID: ' + sender_psid);

  			// Check if the event is a message or postback and
			// pass the event to the appropriate handler function
			if (webhook_event.message) {
				handleMessage(sender_psid, webhook_event.message);        
			} else if (webhook_event.postback) {
				handlePostback(sender_psid, webhook_event.postback);
			}
		});

		// Returns a "200 - OK" response to all requests
		res.status(200).send('EVENT_RECEIVED');
	} else {
		//Returns a '404 - Not Found' if is not from a page subcription
		res.status(404);
	}
});

// REST API
// Method: GET
// endpoint /webhook
// Adds support for GET requests to out webhook
app.get('/webhook', (req, res) => {

	// Your verify token. should be a random string.
	let VERIFY_TOKEN = "EAAIe5UWYjM8BAJw71k4zuqwn5OEZCrC3ZBdaOm5PnnAoXlFNxqb4szZBAuZC1TR3KNfUYKZCNaP7qZCk8eNFrTxFsMegZB6kFHRNqXXa6JZClQsZC7CD1IEsHrkWc4jcRIJo0fneGbZAsUVCcZBfkHX89DJUWC7YfjZAmYnmQoV9lZA2N5yvtZBZADpmdvS";

	// Parse the query params
	let mode = req.query['hub.mode'];
	let token = req.query['hub.verify_token'];
	let challenge = req.query['hub.challenge'];

	// Check if a token and mode is in the query string of the request
	if (mode && token) {

		// Checks the mode and token sent is correct
		if (mode == 'subscribe' && token == VERIFY_TOKEN) {

			// Responds with the challenge token from the request
			console.log('WEBHOOK_VERIFIED');
			res.status(200).send(challenge);
		}
	} else {
		// Responds with '403 Forbidden' if verify tokens do not match
      	res.sendStatus(403);
	}
});

// Handles messages events
function handleMessage(sender_psid, received_message) {

	let response;

	// Check if the message contains text
	if (received_message.text) {    

		// Create the payload for a basic text message
		response = {
	 		"text": `You sent the message: "${received_message.text}". Now send me an image!`
		}
	} else if (received_message.attachments) {
		// Get the URL of the message attachment
	    let attachment_url = received_message.attachments[0].payload.url;
	    response = {
	      "attachment": {
	        "type": "template",
	        "payload": {
	          "template_type": "generic",
	          "elements": [{
	            "title": "Is this the right picture?",
	            "subtitle": "Tap a button to answer.",
	            "image_url": attachment_url,
	            "buttons": [
	              {
	                "type": "postback",
	                "title": "Yes!",
	                "payload": "yes",
	              },
	              {
	                "type": "postback",
	                "title": "No!",
	                "payload": "no",
	              }
	            ],
	          }]
	        }
	      }
	    }
	}	

	// Sends the response message
	callSendAPI(sender_psid, response);    
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
	let response;
  
	// Get the payload for the postback
	let payload = received_postback.payload;
	console.log('handlePostback: ' + payload);
	// Set the response based on the postback payload
	if (payload === 'yes') {
		response = { "text": "Thanks :D!" }
	} else if (payload === 'no') {
		response = { "text": "Oops!, Try sending another image." }
	}

	// Send the message to acknowledge the postback
	callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
	// Construct the message body
	let request_body = {
		"recipient": {
			"id": sender_psid
		},
		"message": response
	}

	// Send the HTTP request to the Messenger Platform
	request({
		"uri": "https://graph.facebook.com/v2.6/me/messages",
		"qs": { "access_token": PAGE_ACCESS_TOKEN },
		"method": "POST",
		"json": request_body
		}, (err, res, body) => {
		if (!err) {
		  console.log('message sent!')
		} else {
		  console.error("Unable to send message:" + err);
		}
	}); 
}