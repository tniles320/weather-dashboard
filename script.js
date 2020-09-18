var currentDay = moment().format("(L)");
var forecastOne = moment().add(1,"days").format().slice(0, 10) + " 18:00:00";
var forecastTwo = moment().add(2,"days").format().slice(0, 10) + " 18:00:00";
var forecastThree = moment().add(3,"days").format().slice(0, 10) + " 18:00:00";
var forecastFour = moment().add(4,"days").format().slice(0, 10) + " 18:00:00";
var forecastFive = moment().add(5,"days").format().slice(0, 10) + " 18:00:00";

var forecastDayOne = moment().add(1,"days").format("L");
var forecastDayTwo = moment().add(2,"days").format("L");
var forecastDayThree = moment().add(3,"days").format("L");
var forecastDayFour = moment().add(4,"days").format("L");
var forecastDayFive = moment().add(5,"days").format("L");

var cities = [];

// sets local storage cities in an array and separates them into individual strings
function resetLocalCities() {
    var oldList = localStorage.getItem("cities");
        if (localStorage.getItem("cities") === null) {
            return;
        } else {
            cities = oldList.split(",");
            addCities(cities);

        }
}


// function to add buttons to city list
function addCities(cities) {
for(var i = 0; i < cities.length; i++) {

    var newButton = $("<button>");
    newButton.addClass("cities");
    newButton.attr("value", cities[i]);
    newButton.text(cities[i]);
    $("#city-list").prepend(newButton);
    }
}

// pushes entered city to array and adds it to local storage
function getLocalCities(cityName) {
    if($("#search-input").val() === "") {
            return;
        } else {
            $("#city-list").html("");
            cities.push(cityName);
            localStorage.setItem("cities", cities);
        }
}

// function to take user input and run it into api url
function inputFunction() {
    if($("#search-input").val() === "") {
            return;
        } else {
        var cityName = $("#search-input").val().trim();
        getLocalCities(cityName);
        getCityInfo(cityName);

        // sets a max number for the array length
        if(cities.length > 10) {
            cities.shift();
            localStorage.setItem("cities", cities);
            addCities(cities);
        } else {
            addCities(cities);
        }
        $("#search-input").val("");
    }
}

// displays local city weather data when page loads
function userLocation() {
    navigator.geolocation.getCurrentPosition(localWeather);
}

function localWeather(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var localURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=21ffb69761330cb50c25f45c59fb7cb9";
    
    $.ajax({
        url: localURL,
        method: "GET"
    })

    .then(function(response) {
        var cityName = response.name;
        getCityInfo(cityName);

    })

}

// function to display forecast info
function displayForecast(forecastTemp, forecastHumidity, forecastIcon, j) {

    // appends container for days forecast
    var forecastDiv = $("<div>");
    forecastDiv.addClass("forecast-container");
    forecastDiv.addClass("" + j);
    $("#future-weather").append(forecastDiv);

    // appends div for date
    var forecastDay = $("<div>");
    forecastDay.addClass("forecast-day" + j);
    $("." +j).append(forecastDay);

    // appends weather icon
    var forecastImage = $("<img>")
    forecastImage.attr("src", forecastIcon);
    forecastImage.addClass("weather-icon");
    $("." + j).append(forecastImage);

    // appends temp and humidity
    var bottomDiv = $("<div>");
    var forecastTempDisplay = "Temp: " + forecastTemp.toFixed(2) + " °F";
    var forecastHumidityDisplay = "Humidity: " + forecastHumidity + "%";
    bottomDiv.html(forecastTempDisplay + "<br>" + forecastHumidityDisplay);
    $("." + j).append(bottomDiv);

}


// search button on click event
$("#search-button").on("click", function() {
    inputFunction();
})

$("#search-input").on("keypress", function(event) {
    if(event.which === 13) {
        event.preventDefault();
        inputFunction();
    }
})

// click event that displays weather info
$("#city-list").on("click", ".cities", function() {
    var cityName = $(this).attr("value");
    getCityInfo(cityName);
})

// displays weather info
function getCityInfo(cityName) {
    $("#current-city").html("");
    $("#current-list").html("");
    $("#future-weather").html("");
    
    // current day weather
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=21ffb69761330cb50c25f45c59fb7cb9";

    $.ajax({
    url: queryURL,
    method: "GET"
    })

    .then(function(response) {

        var city = response.name;

        // sets icon for current weather
        var iconCode = response.weather[0].icon
        var icon = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
        var newImage = $("<img>")
        newImage.attr("src", icon);
        newImage.addClass("weather-icon");

        // sets city for current weather
        var newHead = $("<h2>")
        newHead.text(city + " " + currentDay);
        var oldHead = city + " " + currentDay;
        
        $("#current-city").append(newHead);
        $("#current-city").append(newImage);
        
        // sets background image
        var cloudy = ["02d", "02n", "03d", "03n", "04d", "04n"]
        var rainy = ["09d", "09n", "10d", "10n", "11d", "11n"]

        if(iconCode == "01d") {
            $("body").css({"background-image": "url('images/sunny.jpg')"});
        }
        if(iconCode === "01n") {
            $("body").css({"background-image": "url('images/night.jpg')"});
            $("#current-weather").css({"color": "white"});
            $("#future-forecast").css({"color": "white"});
        }
        for(var k = 0; k < cloudy.length; k++) {
            if(iconCode === cloudy[k]) {
                $("body").css({"background-image": "url('images/cloudy.jpg')"});
            }
        }
        for(var l = 0; l < rainy.length; l++) {
            if(iconCode === rainy[l]) {
                $("body").css({"background-image": "url('images/rainy.jpg')"});
            }
        }
        if(iconCode === "13d" || iconCode === "13n") {
            $("body").css({"background-image": "url('images/snowy.jpg')"});
        }
        if(iconCode === "50d" || iconCode === "50n") {
            $("body").css({"background-image": "url('images/foggy.jpg')"});
        }

        // sets variable for api data
        var temp = (response.main.temp - 273.15) * 9/5 + 32;
        var humidity = response.main.humidity;
        var windSpeed = response.wind.speed * 2.237;

        // variables for latitude and longitude
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var getUV = "https://api.openweathermap.org/data/2.5/uvi?appid=21ffb69761330cb50c25f45c59fb7cb9&lat=" + lat + "&lon=" + lon;

        // api call for uv index
        $.ajax({
            url: getUV,
            method: "GET"
        })

        .then(function(response) {

            var uvIndex = response.value;
            
            // variables for div with weather data
            var newDiv = $("<div>");
            var tempDisplay = "Temperature: " + temp.toFixed(2) + " °F";
            var humidityDisplay = "Humidity: " + humidity + "%";
            var windDisplay = "Wind Speed: " + windSpeed.toFixed(1) + " MPH";
            var uvDisplay = "UV Index: " + uvIndex;

            newDiv.html(tempDisplay + "<br>" + humidityDisplay + "<br>" + windDisplay + "<br>" +  "<div id='uv'>" + uvDisplay + "</div>");

            // appends weather data
            $("#current-list").append(newDiv);

            // changes uv index color
            if(uvIndex > 7) {
                $("#uv").css({"background-color": "rgb(252, 49, 49, 0.8)"});
            } else if(uvIndex > 5) {
                $("#uv").css({"background-color": "rgb(255, 115, 0, 0.8)"});
            } else if(uvIndex > 2) {
                $("#uv").css({"background-color": "rgb(236, 236, 53, 0.8)"});
            } else {
                $("#uv").css({"background-color": "rgb(0, 165, 0, 0.8)"});
            }
        })
    })

    // five day forecast
    var fiveURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=21ffb69761330cb50c25f45c59fb7cb9";

    $.ajax({
    url: fiveURL,
    method: "GET"
    })

    .then(function(response) {

        // loop to find the 5 day forecast info
        for(var j = 0; j < response.list.length; j++) {

            var matchDay = response.list[j].dt_txt;
            var forecastTemp = (response.list[j].main.temp - 273.15) * 9/5 + 32;
            var forecastHumidity = response.list[j].main.humidity;
            var forecastIcon = "https://openweathermap.org/img/wn/" + response.list[j].weather[0].icon + "@2x.png";

            // adds content for each day based off of info at 6:00pm
            if(matchDay == forecastOne) {
                displayForecast(forecastTemp, forecastHumidity, forecastIcon, j);
                $(".forecast-day" + j).append(forecastDayOne);
            }
            if(matchDay == forecastTwo) {
                displayForecast(forecastTemp, forecastHumidity, forecastIcon, j);
                $(".forecast-day" + j).append(forecastDayTwo);
            }
            if(matchDay == forecastThree) {
                displayForecast(forecastTemp, forecastHumidity, forecastIcon, j);
                $(".forecast-day" + j).append(forecastDayThree);
            }
            if(matchDay == forecastFour) {
                displayForecast(forecastTemp, forecastHumidity, forecastIcon, j);
                $(".forecast-day" + j).append(forecastDayFour);
            }
            if(matchDay == forecastFive) {
                displayForecast(forecastTemp, forecastHumidity, forecastIcon, j);
                $(".forecast-day" + j).append(forecastDayFive);
            }
        }
    })
}
/*entry point */
resetLocalCities();
userLocation();

