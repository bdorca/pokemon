var utils=require('./utils')
var googlemaps = require('googlemaps');

var gmAPI = new googlemaps(utils.gMConfig);


function geocode(poke, callback) {
    var reverseGeocodeParams = {
        "latlng": poke.address,
        "result_type": "street_address",
        "language": "hu"
    };

    gmAPI.reverseGeocode(reverseGeocodeParams, function(err, result) {
        poke.formatted_address = result.results[0]? result.results[0].formatted_address: poke.address;
        callback()
    });
}

module.exports={
    geocode:geocode
}
