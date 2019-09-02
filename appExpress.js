const express = require('express');
const bodyParser = require('body-parser');
const request = require("request");
const axios = require("axios");
const app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const PORT = 5000;
const VERIFICATION_TOKEN = '6wBf9ozepxXSFv38niKy7qyH';
const API_URL = 'https://portal-api-2019.azurewebsites.net/wiki/pages';//WIKI api

app.listen(process.env.PORT || PORT, function () {
    console.log('Bot is listening on port ' + PORT);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function getObjectsFromApi() {
    return axios.get(API_URL)
        .then(({ data }) => data);
}

function createAttachmentFromApiObject(value) {
    return {
        "name": value.name,
        "text": value.name,
        "type": "button",
        "value": value.link
    }
}

function sendMessages(RESPONSE_URL) {
    return getObjectsFromApi()
        .then(res => {
            const messagePattern = {
                "attachments": [
                    {
                        "text": "",
                        "fallback": "Shame... buttons aren't supported in this land",
                        "callback_id": "portal_buttons",
                        "color": "#3AA3E3",
                        "attachment_type": "default",
                        "actions": [
                        ]
                    }
                ]
            }
            const actionsArray = res.data;

            var message = messagePattern;
            for (let i = 0; i < actionsArray.length; i++) {
                let value = actionsArray[i];
                message.attachments[0].actions.push(createAttachmentFromApiObject(value));
                if ((i + 1) % 5 == 0) {
                    sendMessageToSlackResponseURL(RESPONSE_URL, message);
                    message.attachments[0].actions = [];
                }
            }
            sendMessageToSlackResponseURL(RESPONSE_URL, message)
            return message;
        })
}

function processCommandParam(request) {
    const parameter = request.text;
    const RESPONSE_URL = request.response_url;

    getObjectsFromApi().then((res) => {
        //TODO replace actionsarray to res
        var message = null;
        const actionsArray = res.data;
        actionsArray.forEach(function (value) {
            for (var keyValue of value.keys) {
                if (keyValue.toLowerCase().includes(parameter.toLowerCase())) {
                    message = {
                        "text": `Link to ${value.name} : ${value.link}`,
                        "replace_original": false
                    };
                    sendMessageToSlackResponseURL(RESPONSE_URL, message);
                    break;
                }
            }
        });

        if (message == null) {
            //parameter isn't exist and we can send bad response
            sendBadResponse(RESPONSE_URL, parameter)
        }
    });


}

function sendBadResponse(url, parameter) {
    var message = {
        "text": `Category with name ${parameter} isn't exist`,
        "replace_original": false
    }
    sendMessageToSlackResponseURL(url, message)
}


app.post('/portal', urlencodedParser, (req, res) => {

    res.status(200).end() // best practice to respond with empty 200 status code
    var reqBody = req.body;
    const RESPONSE_URL = reqBody.response_url;
    if (reqBody.text != "") {
        processCommandParam(reqBody);
        return;
    }
    if (reqBody.token != VERIFICATION_TOKEN) {
        res.status(403).end("Access forbidden");
    } else {
        sendMessages(RESPONSE_URL);
    }
})

app.post('/portalresponse', urlencodedParser, (req, res) => {
    res.status(200).end() // best practice to respond with 200 status
    var actionJSONPayload = JSON.parse(req.body.payload) // parse URL-encoded payload JSON string;
    var message = {
        "text": `Link to ${actionJSONPayload.actions[0].name} : ${actionJSONPayload.actions[0].value}`,
        "replace_original": false
    }
    sendMessageToSlackResponseURL(actionJSONPayload.response_url, message)
})


function sendMessageToSlackResponseURL(responseURL, JSONmessage) {
    var postOptions = {
        uri: responseURL,
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        json: JSONmessage
    }
    request(postOptions, (error, response, body) => {
        if (error) {
            console.log(error);
        }
    })
}
