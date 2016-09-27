
var pokedex = require('./pokedex.json');
var query=require("./query.json")
var config = require('./config.json');


var gMConfig = {
    key: config.gmaps_key,
    stagger_time: 1000, // for elevationPath
    encode_polylines: false,
    secure: true // use https
};


function Pokemon(id, lat, long, disappear) {
    this.id = id;
    this.name = pokedex.pokemon[id - 1].name;
    this.address = lat+","+ long;
    this.formatted_address="";
    var date = new Date(disappear);
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();

    // Will display time in 10:30:23 format
    this.disappear = hours + ':' + minutes.substr(-2);
    this.disappearDate=date;
}


module.exports={
    test_url:config.pokemon_url,
    slack_username:config.slack_username,
    path:query.poketerkep.channel[0],
    hostname:query.poketerkep.hostname,
    gMConfig:gMConfig,
    Pokemon:Pokemon
}
