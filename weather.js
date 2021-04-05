console.log("weather app")
const api = {
    key: "87767968eab32755fe7fe84b6afae600",
    base_url: "https://api.openweathermap.org/data/2.5/"
}
const search = document.querySelector(".search_input");
const cityBtn = document.querySelector(".weather_button");
const locationButton = document.querySelector(".location_button")
const error = document.querySelector(".error");
const cityName = document.querySelector(".location");
const temp = document.querySelector(".temp")
const weathericon = document.querySelector(".icon")
const windspeed = document.querySelector(".wind");
const cloudyness = document.querySelector(".cloudy")
const sunRise = document.querySelector(".sunrise");
const sunSet = document.querySelector(".sunset");
const default_city = "copenhagen";
window.addEventListener("load", () => {
    getData(default_city)
})

locationButton.addEventListener("click", geoLocation);
cityBtn.addEventListener("click", getInput);

//function to get current location
function geoLocation() {
    const successCallback = (position) => {
        localStorage.setItem("latitude", position.coords.latitude);
        localStorage.setItem("langitude", position.coords.longitude);
        getLocationData(position.coords.latitude, position.coords.longitude);
    }
    const errorCallback = (error) => {
        error.textContent = "";
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback)

    } else {
        alert("Geolocation is not supported by your browser");
    }

}

function getInput() {
    if (search.value != "") {
        error.textContent = "";
        getData(search.value);
        console.log(search.value);
    } else {
        error.textContent = "please enter city name";
        emptyingTags();
    }
}

//fetching from current locations latitude, longitude
function getLocationData(lat, lon) {
    console.log(lat, lon)
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=87767968eab32755fe7fe84b6afae600`;
    fetch(url)
        .then(response => {
            return response.json();
        }).then(displayData);
}
//fetching from cityname
function getData(cityName) {
    url = `${api.base_url}weather?q=${cityName}&units=metric&appid=${api.key}`
    fetch(url)
        .then(response => {
            return response.json();
        }).then(displayData);
}

//displaying weather information
function displayData(response) {
    console.log(response);
    if (response.cod === "404") {
        const error = document.querySelector(".error");
        error.textContent = "Please enter a valid city";
        search.value = "";
        emptyingTags();
    } else {
        error.textContent = "";
        cityName.textContent = `Location : ${response.name}`;
        temp.innerText = `Current Temp :  ${Math.ceil(response.main.temp)} °C`;
        weathericon.src = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
        windspeed.innerText = `Wind Speed : ${response.wind.speed} km/s`;
        cloudyness.innerText = `Clouds : ${response.weather[0].description}`;
        const sunRiseSec = (response.sys.sunrise * 1000);
        const sunSetSec = (response.sys.sunset * 1000);
        const sunRiseDate = new Date(sunRiseSec)
        const sunSetDate = new Date(sunSetSec)
        sunRise.innerText = `Sunrise : ${sunRiseDate.toLocaleTimeString()}`;
        sunSet.innerText = `Sunset : ${sunSetDate.toLocaleTimeString()}`;
        search.value = "";

        //for map    
        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: response.coord.lat, lng: response.coord.lon },
            //    center: { lat: 55.655989899999994, lng: 12.4719763 },
            zoom: 10,
        });
    }
}

function emptyingTags() {
    cityName.textContent = "";
    temp.innerText = "";
    weathericon.src = "";
    windspeed.innerText = "";
    cloudyness.innerText = "";
    sunRise.innerText = "";
    sunSet.innerText = "";
    document.getElementById("map").innerHTML = "";

}



