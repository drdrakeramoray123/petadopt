var api_key = "9fe9ad18a33741fb93e8dabdbc4555fd";

async function geoCodeToAddress(latitude, longitude, callback) {
    var api_url = "https://api.opencagedata.com/geocode/v1/json";

    var request_url =
        api_url +
        "?" +
        "key=" +
        api_key +
        "&q=" +
        encodeURIComponent(latitude + "," + longitude) +
        "&pretty=1" +
        "&no_annotations=1";
    var request = new XMLHttpRequest();
    request.open("GET", request_url, true);

    request.onload = function () {
        if (request.status === 200) {
            // Success!
            var data = JSON.parse(request.responseText);
            let response = data.results[0].components;
            callback(response);
        } else if (request.status <= 500) {
            // We reached our target server, but it returned an error

            console.log("unable to geocode! Response code: " + request.status);
            var data = JSON.parse(request.responseText);
            console.log("error msg: " + data.status.message);
        } else {
            console.log("server error");
        }
    };

    request.onerror = function () {
        // There was a connection error of some sort
        console.log("unable to connect to server");
    };

    request.send(); // make the request
}
