var builder = require('botbuilder');
var message = require('./message');
var http = require('http');
var request = require('request');
var moment = require('moment');


var model = process.env.model || 'https://api.projectoxford.ai/luis/v1/application?id=ce9081fa-e36d-44cb-a510-76bcb9035bd7&subscription-key=c44b73c3cbcd4060b7be0844b4044f6d&q=';
//var model = process.env.model || 'https://api.projectoxford.ai/luis/v1/application?id=a19fd36f-ec91-4e0d-9a28-492cf56936e4&subscription-key=c44b73c3cbcd4060b7be0844b4044f6d&q=';
//var model = process.env.model || 'https://api.projectoxford.ai/luis/v1/application?id=5d6ff76e-8dbe-466c-9daf-493701814eef&subscription-key=7992140f378349d5be19042f01bc09f3&q='
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });

module.exports = dialog;


dialog.matches('Welcome', [
    function (session, args) {
       session.send(message.welcomeMsg, session.message.address.user.name);
    }
]);

dialog.matches('Favoris', [
    function (session, args) {
       session.send("C’est fait. Des membres du Club ayant les mêmes goûts que vous ont recommandé ce reportage sur Nestlé et sa politique de l’eau : http://www.arte.tv/guide/fr/041127-000-A/nestle-et-le-business-de-l-eau-en-bouteille");
    }
]);

dialog.matches('ArteClub', [
    function (session, args) {
       session.send("Arte Club, c’est gratuit et c’est le meilleur d’Arte pour vous ! Il suffit de cliquer ici pour tout savoir : https://club.arte.tv");
    }
]);

dialog.matches('EasterEgg', [
    function (session, args) {
       session.send("Héhéhé ! Voici un article qui résume bien l’état actuel des choses : http://info.arte.tv/fr/france-allemagne-un-nouveau-coup-de-rhin");
    }
]);


dialog.matches('Search', [
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
        /*console.log("Data : ");
        console.log(session.dialogData);
        console.log("\n\n"); */
        var search = session.dialogData.search;
      /*  console.log("Result : ");
        console.log(results);
        console.log("\n\n");

        console.log("Search : ");
        console.log(search);
        console.log("\n\n");*/

        // Récupération du code du type de contenu (Temporaire)
        var contentType = '';
        if(search.typeOfContent == 'série' || search.typeOfContent == 'séries')
        {
            contentType = 'FIC';
        }
        else if(search.typeOfContent == 'documentaire' || search.typeOfContent == 'documentaires')
        {
            contentType = 'DEC';
        }
        else if(search.typeOfContent == 'cinéma' || search.typeOfContent == 'film' || search.typeOfContent == 'films')
        {
            contentType = 'CIN';
        }

        var dateRequest = moment();

        if(search.moment = "demain")
        {
            dateRequest = dateRequest.add(1, 'days');
        }
        else if(search.moment = "cette semaine")
        {
            dateRequest = dateRequest.add(2, 'days');
        }

        session.send(message.searchResume, search.typeOfContent, search.moment);

        var options = {
             url: 'https://api.arte.tv/api/opa/v2/search/broadcastProgrammings',
             headers: {
                 'Authorization': 'Bearer NjhlOGRiM2UzZTU4ZmU5ZWFmM2UxNGFhNGY4Yjc2MGFmZWVjYTc1NmE5Y2U4YTI5OTIyMzA1YzQ1ZWZhOWExNw',
                 'Accept' : 'application/vnd.api+json; version=2.32'
             },
             qs: {
                 'channel' : 'FR',
                 'arteSchedulingDay' : dateRequest.toISOString().substring(0, 11),
                 'limit' : '1',
                 'program.categories.code' : contentType
             }
         };

         console.log("----- Search ----")
         console.log(dateRequest.toISOString().substring(0, 11));
         console.log(contentType);

        request(options, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                  var data = JSON.parse(body);

                  for(var i = 0; i < data.broadcastProgrammings.length; i++)
                  {
                      var card = new builder.HeroCard(session)
                                .title(data.broadcastProgrammings[i].program.title)
                                .subtitle(data.broadcastProgrammings[i].program.subtitle)
                                .images([
                                    builder.CardImage.create(session, data.broadcastProgrammings[i].program.mainImage.url)
                                ])
                                .buttons([builder.CardAction.openUrl(session, data.broadcastProgrammings[i].program.url, 'Détail')])

                       var msg = new builder.Message(session).attachments([card]);
                       session.send(msg);
                  }
              }
              else
              {
                  var data = JSON.parse(body);

                  console.log(data.errors[0].detail);

                  session.send(data.errors[0].detail);
              }
          })
    }
]);
