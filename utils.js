//var pokemon_url = "https://hooks.slack.com/services/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";
var test_url="https://hooks.slack.com/services/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"
var slack_username = "pokebot"
var pokedex = require('./pokedex.json');

var gMConfig = {
    key: 'AIzaSyCAgXTGpIHG_GH66kiXWDe69TJ_y9RDrV8',
    stagger_time: 1000, // for elevationPath
    encode_polylines: false,
    secure: true // use https
};

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
    this.disappearDate=date;
}


module.exports={
    test_url:test_url,
    slack_username:slack_username,
    gMConfig:gMConfig,
    Pokemon:Pokemon
}
