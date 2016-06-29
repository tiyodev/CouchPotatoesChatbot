var builder = require('botbuilder');

var model = process.env.model || 'https://api.projectoxford.ai/luis/v1/application?id=a19fd36f-ec91-4e0d-9a28-492cf56936e4&subscription-key=c44b73c3cbcd4060b7be0844b4044f6d&q=';
var dialog = new builder.LuisDialog(model);
module.exports = dialog;

dialog.onDefault(builder.DialogAction.send("I'm sorry I didn't understand."));

/** Prompts a user for the title of the task and saves it.  */
dialog.on('Welcome', [
    function (session, args, next) {
        builder.Prompts.text(session, "Bonjour mec !");
    }
]);
