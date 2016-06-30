var builder = require('botbuilder');

var model = process.env.model || 'https://api.projectoxford.ai/luis/v1/application?id=28bafb7d-f89e-49dc-8fda-498d0c20ce5a&subscription-key=7992140f378349d5be19042f01bc09f3&q=';
var dialog = new builder.LuisDialog(model);
module.exports = dialog;

dialog.onDefault(builder.DialogAction.send("Moi pas comprendre toi !"));

/** Prompts a user for the title of the task and saves it.  */
dialog.on('Welcome', [
    function (session, args, next) {
        builder.Prompts.text(session, "Bien le bonjour de la part de Couch Potatoes Chat Bot !");
    }
]);
