var builder = require('botbuilder');
var message = require('./message');
var http = require('http');
var request = require('request');

var model = process.env.model || 'https://api.projectoxford.ai/luis/v1/application?id=a19fd36f-ec91-4e0d-9a28-492cf56936e4&subscription-key=c44b73c3cbcd4060b7be0844b4044f6d&q=';
//var model = process.env.model || 'https://api.projectoxford.ai/luis/v1/application?id=5d6ff76e-8dbe-466c-9daf-493701814eef&subscription-key=7992140f378349d5be19042f01bc09f3&q='
var dialog = new builder.LuisDialog(model);
module.exports = dialog;


dialog.onDefault( 
   // console.log(new Date(Date.UTC(16, 08, 22, 0, 0, 0)))
);


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
        console.log("Data : ");
        console.log(session.dialogData);
        console.log("\n\n");
        var search = session.dialogData.search;
        console.log("Result : ");
        console.log(results);
        console.log("\n\n");

        console.log("Search : ");
        console.log(search);
        console.log("\n\n");

       // if (results.response) {
            //var moment = builder.EntityRecognizer.findEntity(results.response, 'Moment');
            //console.log(moment);
            //search.moment = moment ? moment.entity : null;

            //console.log("YBO 1");

            search.moment = results.response;

           // console.log("YBO 2");

            session.send(message.searchResume, search.typeOfContent, search.moment);

           // console.log("YBO 3");

           var test = new Date().toISOString(); 
          // var dateDemain;

           // if(search.moment = 'demain')
           // {
              //  console.log(test);

              //  var jourSemaine = test.getYear();

              //  console.log(test.getYear());
               // console.log(test.getMonth());
               // console.log(test.getDay());
              //  dateDemain = new Date(Date.UTC(test.getYear(), test.getMonth(), test.getDay() + 1, 0, 0, 0));
              //  console.log(dateDemain);
            //}

          //  session.send("Erreur durant la recherche !");

         /*   var options = {
                url: 'https://api.arte.tv/api/opa/v2/schedule/after/2016-08-16T00:00:00Z',
                headers: {
                    'Authorization': 'Bearer NjhlOGRiM2UzZTU4ZmU5ZWFmM2UxNGFhNGY4Yjc2MGFmZWVjYTc1NmE5Y2U4YTI5OTIyMzA1YzQ1ZWZhOWExNw',
                    'Accept' : 'application/vnd.api+json; version=2.1'
                },
                qs: {
                    'language' : 'fr',
                    'country' : 'FR',
                    'limit' : '3'
                }
            };

            console.log("YBO 4");

            //'broadcastProgrammings.broadcastBegin' : new Date(Date.UTC(16, 08, 22, 0, 0, 0))

            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log("YBO 5");
                    console.log(body) // Show the HTML for the Google homepage.
                }
                else
                {
                    console.log("YBO 6");
                    session.send("Erreur durant la recherche !");
                }
            })*/
        //}
    }
]);
