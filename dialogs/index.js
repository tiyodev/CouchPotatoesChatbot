var builder = require('botbuilder');
var message = require('./message');

var model = process.env.model || 'https://api.projectoxford.ai/luis/v1/application?id=a19fd36f-ec91-4e0d-9a28-492cf56936e4&subscription-key=c44b73c3cbcd4060b7be0844b4044f6d&q=';
var dialog = new builder.LuisDialog(model);
module.exports = dialog;

//dialog.onDefault(builder.DialogAction.send("Moi pas comprendre toi !"));

dialog.on('Welcome', [
    function (session, args) {
        session.send(message.welcomeMsg, session.message.from.name);
    }
]);


dialog.on('Search', [
    function (session, args, next) {
        //test si la personne à précisé le type de contenu qu'elle souhaite regarder
        var typeOfContent = builder.EntityRecognizer.findEntity(args.entities, 'TypeOfContent');
        var moment = builder.EntityRecognizer.findEntity(args.entities, 'Moment');

        var search = session.dialogData.search = {
            typeOfContent: typeOfContent ? typeOfContent.entity : null,
            moment: moment ? moment.entity : null  
        };
        // Si le type de contenu n'est pas présent, demander une précision à l'utilisateur
        if(!typeOfContent){
            builder.Prompts.text(session, message.typeOfContent);
        }
        else{
            next();
        }
    },
    function (session, results, next) {
        var search = session.dialogData.search;
        if (results.response) {
            search.typeOfContent = results.response;
        }

        // Si le moment n'est pas présent, demander une précision à l'utilisateur
        if (search.typeOfContent && !search.moment) {
            builder.Prompts.text(session, message.moment);
        } else {
            next();
        }
    },
    function (session, results) {
        var search = session.dialogData.search;
        console.log(results);
        if (results.response) {
            //var moment = builder.EntityRecognizer.findEntity(results.response, 'Moment');
            //console.log(moment);
            //search.moment = moment ? moment.entity : null;
            search.moment = results.response;
        }

        session.send(message.searchResume, search.typeOfContent, search.moment);
    }
]);
