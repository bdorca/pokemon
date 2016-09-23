var IncomingWebhooks = require('@slack/client').IncomingWebhook;
var googlemaps = require('googlemaps');
var pokedex = require('./pokedex.json');
var https = require('https');

//var pokemon_url = "https://hooks.slack.com/services/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";
var test_url="https://hooks.slack.com/services/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"
var wh = new IncomingWebhooks(test_url);

var slack_username = "pokebot"

var addresses_got = 0
var myPokeList = [];

var publicConfig = {
    key: 'AIzaSyCAgXTGpIHG_GH66kiXWDe69TJ_y9RDrV8',
    stagger_time: 1000, // for elevationPath
    encode_polylines: false,
    secure: true // use https
};
var gmAPI = new googlemaps(publicConfig);
getPokes();

function Pokemon(id, lat, long, disappear) {
    this.id = id;
    this.name = pokedex.pokemon[id - 1].name;
    this.address = "";
    this.lat = lat;
    this.long = long;
    var date = new Date(disappear);
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();

    // Will display time in 10:30:23 format
    this.disappear = hours + ':' + minutes.substr(-2);
}

function geocode(poke) {
    var reverseGeocodeParams = {
        "latlng": poke.lat + "," + poke.long,
        "result_type": "street_address",
        "language": "hu"
    };

    gmAPI.reverseGeocode(reverseGeocodeParams, function(err, result) {
        console.log(result.results[0].formatted_address);
        poke.address = result.results[0].formatted_address;
        if (++addresses_got == myPokeList.length) {
            send_slack()
        }
    });
}

function send_slack() {
    for (var i = 0; i < myPokeList.length; i++) {
        var msg = myPokeList[i].name + " @" + myPokeList[i].address + ", until:" + myPokeList[i].disappear;
        console.log(msg)
        wh.send({
            text: msg,
            username: slack_username
        });
    }
}

function getPokes() {
    https.get({
        hostname: 'api.poketerkep.hu',
        path: '/game?gyms=false&neLat=47.58616187&neLng=19.22375896&pokemons=true&pokestops=false&selectedPokemons=cAAAAgAAAAgAAAADwAAAAAyCMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%3D%3D&showOrHide=true&swLat=47.44982478&swLng=18.91785839',
        headers: {
            "Accept": "application/json"
        }
    }, (res) => {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            console.log('BODY: ' + chunk);
            var pokemons = JSON.parse(chunk).pokemons;
            for (var i = 0; i < pokemons.length; i++) {
                var poke = pokemons[i]
                myPokeList.push(new Pokemon(poke["pokemon_id"], poke["latitude"], poke["longitude"], poke["disappear_time"]))
                geocode(myPokeList[i])
            }
        });
        res.resume();
    }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
    });
}
