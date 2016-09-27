var https = require('https');
var utils=require('./utils');
var slack=require('./slack');
var gmaps=require('./gmaps');
var Pokemon=require('./utils').Pokemon;

var addresses_got = 0;
var new_pokes=0;
var myPokeList = {};
var newPokeIds=[];


getPokes()
setInterval(getPokes,60000)

function getPokes() {
    addresses_got=0;
    newPokeIds.splice(0);
    https.get({
        hostname: utils.hostname,
        path: utils.path,
        headers: {
            "Accept": "application/json"
        }
    }, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            console.log('BODY: ' + chunk);
            var pokemons = JSON.parse(chunk).pokemons;
            for (var i = 0; i < pokemons.length; i++) {
                var poke = pokemons[i]
                var enc_id=poke["encounter_id"]
                if(!myPokeList.hasOwnProperty(enc_id)){
                    var p=new Pokemon(poke["pokemon_id"], poke["latitude"], poke["longitude"], poke["disappear_time"]);
                    myPokeList[enc_id]=p
                    newPokeIds.push(enc_id)
                    gmaps.geocode(myPokeList[enc_id], function(){
                        if (++addresses_got >= newPokeIds.length) {
                            sendSlack()
                            GC()
                        }
                    })
                }
            }
        });
        res.resume();
    }).on('error', function(e) {
        console.log('Got error: '+e.message);
    });
}

function GC(){
    var now=new Date()
    for(var k in myPokeList){
        if(myPokeList[k].disappearDate<now){
            delete myPokeList[k]
        }
    }
}

function sendSlack() {
    for (var i=0;i<newPokeIds.length;i++) {
        // var msg = `${myPokeList[newPokeIds[i]].name} @${myPokeList[newPokeIds[i]].address} *until: ${myPokeList[newPokeIds[i]].disappear}*`;
         var msg = myPokeList[newPokeIds[i]].name + " @<http://maps.google.com/?q="+myPokeList[newPokeIds[i]].address +"|"+myPokeList[newPokeIds[i]].formatted_address+ ">"+ " *until: "+myPokeList[newPokeIds[i]].disappear+"*";

        console.log(msg)
        slack.sendMessage(msg)
    }
}
