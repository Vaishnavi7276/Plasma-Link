var locationData = ``;
const options = {
    enableHighAccuracy: true, 
    timeout: 5000, 
    maximumAge: 2000, 
};

navigator.geolocation.watchPosition(success, error, options);


function success(pos) {

    const latitude = pos.coords.latitude;
    const longitude = pos.coords.longitude;
    const accuracy = pos.coords.accuracy; 

    document.getElementById("latitude").textContent = latitude;
    document.getElementById("longitude").textContent = longitude; 

    const link = `<a href="https:/www.google.com/maps?q=${latitude},${longitude}">Location</a>`;
    document.getElementById('output').innerHTML = link;
    locationData = `https:/www.google.com/maps?q=${latitude},${longitude}`;


}

function error(err) {

    if (err.code === 1) {
        alert("Please allow geolocation access");
        // Runs if user refuses access
    } else {
        alert("Cannot get current location");
        // Runs if there was a technical problem.
    }

}

