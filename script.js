var APIKey = "82fcfb57b845804458f56e1829f74f3b";                             //create variable to store API key                                              

var cityInputEl = document.querySelector("#city-input");
var cityList = document.querySelector("#city-list");
var todayContainer = document.querySelector("#city-weather-container");
var forecastContainer = document.querySelector("#forecast-container");
var buttonElm = document.getElementById("search-city")
var cities = [];

function searchCity(city) {
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;  //construct a query URL "https://openweathermap.org/current#name" using string concatenation to store the OW current weather data URL and the necessary variables

    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        //$("#city-weather-container").empty();                                   //empty the contents of the city-weather-container, append the new city content
        //var newData =$("<main>");

        console.log(queryUrl);
        console.log(response);                                                  //print the object to console

        var city = response.name;
        $(".city").html("<h1>" + city + " Weather Details</h1>");               //construct HTML containing current city information

        $(".temp").text("Temperature(K): " + response.main.temp);

        $(".humidity").text("Humidity: " + response.main.humidity);

        var windSpeed = response.wind.speed;
        $(".wind").html("<p>Wind Speed: " + windSpeed + "</p>");

        var latitude = response.coord.lat;                                      //get UV Index from onecall URL
        var longtitude = response.coord.lon;
        function UVIndex(lat, lon) {
            var lat = latitude;
            var lon = longtitude;
            queryUrlUVI = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly" + "&appid=" + APIKey; //URL for UV Index
            $.ajax({
                url: queryUrlUVI,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                var uvIndex = $("<main>");
                $(".UVIndex").append(uvIndex)
                uvIndex.text("UV Index: " + response.current.uvi)
                console.log("UV Index: " + response.current.uvi);
            })
        }
        console.log("Temperature(K): " + response.main.temp);
        console.log("Humidity: " + response.main.humidity);
        console.log("Wind Speed: " + response.wind.speed);

        UVIndex();
    });
}

$("#search-city").on("click", function (event) {                              //event handler for user searching the search-city button
    event.preventDefault();                                                 //prevent the button from trying to submit the request
    var inputCity = $("#city-input").val().trim();                          //Store the city name
    searchCity(inputCity);

    fiveDayForecast(inputCity);                                                    //get the 5 day forecast

    cities.push(inputCity);                                                  //Add new cityText to cities array, clear the input
    $("#city-input").value = "";

    storeCities();
    renderCityList();
});

function renderCityList() {                                                  //create city list search history
    cityList.innerHTML = "";

    for (var i = 0; i < cities.length; i++) {                                //render a new li for each city
        var city = cities[i];
        var li = document.createElement("li");
        li.textContent = city;
        li.setAttribute("data-index", i);
        cityList.appendChild(li);
    }
}

function init() {                                                           //store cities from localStorage and retrieve it using getItem
    var storedCities = JSON.parse(localStorage.getItem("cities"));

    if (storedCities !== null) {                                            //if cities were retrieved from localStorage, update the cities array
        cities = storedCities;
    }
    renderCityList();
}

function storeCities() {                                                    //store an array using localStorage
    localStorage.setItem("cities", JSON.stringify(cities));
}

function fiveDayForecast(city) {
    $("#1").empty();                                                        //clear history
    $("#2").empty();
    $("#3").empty();
    $("#4").empty();
    $("#5").empty();

    //var queryUrlForecast = "https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=" + lat + "&lon=" + lon + "&dt={time}" + "&appid=" + APIKey;  //construct a query for retrieving data again
    var queryUrlForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
    $.ajax({
        url: queryUrlForecast,
        method: "GET"
    }).then(function (response) {
        console.log(queryUrlForecast);    
        console.log(response);
        //$("#city-weather-container").empty();                                   //empty the contents of the city-weather-container, append the new city content
        //var newData =$("<main>");   

        str = [1, 2, 3, 4, 5]
        for (i = 0; i < str.length; i++) {
            var forecastDate = $("<div>");
            forecastDate.text(moment().add(i + 1, "days").format("MM/DD/YYYY"));
            $("#" + str[i]).append(forecastDate);

            var tempForecast = $("<div>");
            $("#" + str[i]).append(tempForecast);

            function changeTemp() {                                                  //convert K to °F
                var fahrenheit = parseFloat(response.list[i].main.temp);
                var convertTemp = Math.round((fahrenheit - 273.15) * (9 / 5) + 32);
                tempForecast.text("Temp: " + convertTemp + "°F");
            }
            changeTemp();

            var humidityForecast = $("<div>");                                      // get humidity forecast
            $("#" + str[i]).append(humidityForecast);
            humidityForecast.text("Humidity: " + response.list[i].main.humidity);
        }
    })
};









