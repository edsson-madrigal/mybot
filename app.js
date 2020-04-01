'use strict';

const dialogflow = require('dialogflow');
const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const uuid = require('uuid');


if (!config.GOOGLE_PROJECT_ID) {
    throw new Error('missing GOOGLE_PROJECT_ID');
}
if (!config.DF_LANGUAGE_CODE) {
    throw new Error('missing DF_LANGUAGE_CODE');
}
if (!config.GOOGLE_CLIENT_EMAIL) {
    throw new Error('missing GOOGLE_CLIENT_EMAIL');
}
if (!config.GOOGLE_PRIVATE_KEY) {
    throw new Error('missing GOOGLE_PRIVATE_KEY');
}
if (!config.SERVER_URL) { //used for ink to static files
    throw new Error('missing SERVER_URL');
}



app.set('port', (process.env.PORT || 5000))

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());




const credentials = {
    client_email: config.GOOGLE_CLIENT_EMAIL,
    private_key: config.GOOGLE_PRIVATE_KEY,
};

const sessionClient = new dialogflow.SessionsClient(
    {
        projectId: config.GOOGLE_PROJECT_ID,
        credentials
    }
);


const sessionIds = new Map();

//sendToDialogFlow2("fbcd6e2b-70f3-f317-d135-1b09c83018bb");

async function sendToDialogFlow2(sessionId, params) {
    try {
        const sessionPath = sessionClient.sessionPath(
            config.GOOGLE_PROJECT_ID,
            sessionId
        );
        var textString = "something smart";

        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: textString,
                    languageCode: config.DF_LANGUAGE_CODE,
                },
            },
            queryParams: {
                payload: {
                    data: params
                }
            }
        };

        sessionClient
            .detectIntent(request)
            .then(responses => {
                console.log(request);
                console.log(responses);
                console.log(JSON.stringify(responses));
            })
            .catch(err => {
                console.error('ERROR**:', err);
            });
    } catch (e) {
        console.log('error');
        console.log(e);
    }
}


/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page. 
 * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
 *
 */
app.post('/webhook/', function(req, res) {
    var data = req.body;
    console.log(JSON.stringify(data));
    sendToDialogFlow(data,"",res);
});

async function sendToDialogFlow(data, params, res) {
    try {

        var sessionId = data.session.split('/')[4];

        const sessionPath = sessionClient.sessionPath(
            config.GOOGLE_PROJECT_ID,
            sessionId
        );
        var textString = "something smart";

        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: textString,
                    languageCode: config.DF_LANGUAGE_CODE,
                },
            },
            queryParams: {
                payload: {
                    data: params
                }
            }
        };

        sessionClient
            .detectIntent(request)
            .then(responses => {

			res.json({
			            "fulfillmentText": "HELL WORLD DOG"
			        });
//	            res.json(responses);
				//res.sendStatus(200);

/*
                console.log(request);
                console.log(responses);
                console.log(JSON.stringify(responses));
*/
            })
            .catch(err => {
                console.error('ERROR**:', err);
            });

    } catch (e) {
        console.log('error');
        console.log(e);
    }
}



// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})