const geoip = require('geoip-lite');

// Function to get location based on IP address
function getLocation(ip) {
    const geo = geoip.lookup(ip);
    if (geo) {
        return {
            city: geo.city,
            region: geo.region,
            country: geo.country,
            ll: geo.ll // Latitude and Longitude
        };
    } else {
        return null;
    }
}

module.exports = {
    getLocation
};