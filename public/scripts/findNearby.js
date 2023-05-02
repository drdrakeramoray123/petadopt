const searchInput = document.getElementById("search");

searchInput.addEventListener("change", (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value;
    window.location.href = `?city=${searchTerm}`;
});

let latitude;
let longitude;
let city;

navigator.geolocation
    ? navigator.geolocation.getCurrentPosition(success, error)
    : error();

async function success(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    console.log(
        `%cLatitude: ${latitude}`,
        "color: #7FDBFF; font-weight: bold;"
    );
    console.log(
        `%cLongitude: ${longitude}`,
        "color: #7FDBFF; font-weight: bold;"
    );

    // Show nearby pets
    if (!window.location.search.includes("?city=")) {
        await geoCodeToAddress(latitude, longitude, setCity);
    }
}

function error() {
    console.log(
        "%cGeolocation is not supported by this browser.",
        "color: #7FDBFF; font-weight: bold;"
    );
}

function setCity(response) {
    city = response.suburb || response.city;
    console.log(`%cCity: ${city}`, "color: #7FDBFF; font-weight: bold;");
    window.location.href = `?city=${city}`;
}
