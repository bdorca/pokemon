var IncomingWebhooks = require('@slack/client').IncomingWebhook;
var utils=require('./utils')

var wh = new IncomingWebhooks(utils.test_url);


function sendWhMessage(msg){
    wh.send({
        text: msg,
        username: utils.slack_username
    });
}

module.exports={
    sendMessage:sendWhMessage
}
