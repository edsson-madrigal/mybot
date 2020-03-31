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


/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page. 
 * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
 *
 */
app.post('/webhook/', function (req, res) {
    //console.log("HERE");
    var data = req.body;
    //console.log("sessionid"+data["session"]);
    consoe.log(data);
    console.log(JSON.stringify(data));
    session = data['session'];
    session = session.split('/')[-1];
    console.log("sessionid"+session);
    //sendToDialogFlow(data);
    res.sendStatus(200);
});

async function sendToDialogFlow(data)
{
    try {
//        const sessionPath = sessionClient.sessionPath(
//            config.GOOGLE_PROJECT_ID,
//            sessionIds.get(sender)
//        );
        
        sessionId = data["session"].split('/')[-1];
        console.log("session id"+sessionId);
          // Create a new session
          const sessionClient = new dialogflow.SessionsClient();
          const sessionPath = sessionClient.sessionPath(
              config.GOOGLE_PROJECT_ID,
              sessionId
          );
        
        
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
        const responses = await sessionClient.detectIntent(request);
        
        console.log("responses:"+JSON.stringify(responses));
        
        const result = responses[0].queryResult;
        handleDialogFlowResponse(sender, result);
    } catch (e) {
        console.log('error');
        console.log(e);
    }     
}



// Spin up the server
app.listen(app.get('port'), function () {
    console.log('running on port', app.get('port'))
})
