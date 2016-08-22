var restify = require('restify');
var builder = require('botbuilder');
var index = require('./dialogs/index')

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: 'c1b9c7e2-d311-48e4-8ad4-67e9c14583f2',
    appPassword: 'ydP2SmeAO5Gm5TiefEDGm16'
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', index);





/*
// Create bot and add dialogs
var bot = new builder.UniversalBot({ appId: '12345678900987654321', appSecret: 'ab87d13b80f642cea7ed25d934497dd9' });
bot.dialog('/', index);

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});
*/
