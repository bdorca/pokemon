var utils=require('./utils')
var googlemaps = require('googlemaps');

var gmAPI = new googlemaps(utils.gMConfig);


function geocode(poke, callback) {
    var reverseGeocodeParams = {
        "latlng": poke.lat + "," + poke.long,
        "result_type": "street_address",
        "language": "hu"
    };

    gmAPI.reverseGeocode(reverseGeocodeParams, function(err, result) {
        console.log(result.results[0].formatted_address);
        poke.address = result.results[0].formatted_address;
        callback()
    });
}

module.exports={
    geocode:geocode
}
