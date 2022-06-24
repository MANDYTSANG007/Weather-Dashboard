
function searchCity(city){
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/onecall?"
            + "lat=" + city.lat
            + "&lon=" + city.lon
            + "&units=imperial"
            + "&exclude=hourly"
            + "&appid=82fcfb57b845804458f56e1829f74f3b",
        method: "GET",
    }).then(function(response) {
        console.log(response);
        displayToday(response, city);
        displayForecast(response);
    });
}

function displayToday(response, city) {
    const current = response.current;
    const icon = getIcon(current.weather[0].icon, current.weather[0].description);
    const cityName = $('<h2>').text(city.name).attr('id', 'city-name').prepend(icon);
    const temperature = $('<p>').text('Temperature: ' + current.temp + " °F");
    const humidity = $('<p>').text('Humidity: ' + current.humidity + ' %');
    const wind = $('<p>').text('Wind Speed: ' + current.wind_speed + " mph");
    const date = $('<h2>').text( moment().format('dddd, MMMM Do YYYY')).attr('id', 'date');

    $('#current').html('');
    $('#current').append(cityName, temperature, humidity, wind, date);
}

$('#search-form').on('submit', function(event) {
    event.preventDefault();
    cityQuery = $('#search-box').val();
    getCoordinates(cityQuery);
});

function displayForecast(response) {
    const daily = response.daily;

    $('#forecast').html('')
    for (var i = 1; i < 6; i++) {
        const date = $('<h5>').text(moment.unix(daily[i].dt).format('MM/DD'));
        const icon = getIcon(daily[i].weather[0].icon, daily[i].weather[0].description);
        const temperature = $('<p>').text('Temp: ' + daily[i].temp.day + " °F");
        const humidity = $('<p>').text('Humidity: ' + daily[i].humidity + ' ' + '%');
        let card = $('<div>').append(date, icon, temperature, humidity);
        card.attr('class', 'card text-white mr-3 col-lg-2 col-md-3 col-sm-4');
        $('#forecast').append(card);
    }
}

function getCoordinates(cityQuery) {
    if (!cityQuery) {
        cityQuery = "Los Angeles"
    }
    $.ajax({
        url: "http://api.openweathermap.org/geo/1.0/direct?"
            + "q=" + cityQuery
            + "&limit=" + 1
            + "&appid=82fcfb57b845804458f56e1829f74f3b",
        method: "GET",
    }).then(function(response) {
        console.log(response[0]);

        if (response.length === 0) {
            return alert("City not found, please try again!");
        }
        city = {
            name: response[0].name,
            state: response[0].state,
            country: response[0].country,
            lat: response[0].lat,
            lon: response[0].lon,
        }
        searchCity(city);
        saveHistory(city);
        showHistory();
    })
}

// function getIcon(iconCode, description) {
//     return '<img alt=""' + description + '"src=" https://openweathermap.org/img/wn/' + iconCode + '"10d@2x.png">'
// }
function getIcon(iconCode, description) {
    return "<img alt=''" + description + "' src='https://openweathermap.org/img/wn/" + iconCode + "@2x.png'>"
}

function makeActive(button) {
    button.addClass('active');
    button.siblings().removeClass('active');
}

function saveHistory(city) {
    let getHistory = JSON.parse(localStorage.getItem('getHistory'));
    if (!getHistory) {
        getHistory = [];
    }

    const isHistory = (element) => element.name === city.name;
    if (getHistory.findIndex(isHistory) > 0) {
        getHistory.splice(getHistory.findIndex(isHistory), 1);
        getHistory.unshift(city);
    } else if (getHistory.findIndex(isHistory) !== 0 ) {
        getHistory.unshift(city);
    }

    while (getHistory.length > 10 ) {
        getHistory.pop();
    }

    localStorage.setItem('getHistory', JSON.stringify(getHistory));
};

function showHistory() {
    let getHistory = JSON.parse(localStorage.getItem('getHistory'));

    if (!getHistory) {
        getHistory = [];
    }

    $('#get-history').html('');
    $.each(getHistory, function(i, input) {
        const li = $('<li>').text(input.name);
        li.attr('class', 'list-group-item');
        li.attr('data-index', i);
        $('#get-history').append(li);
    })
    makeActive($('#get-history :first-child'));
}

$('#get-history').on('click', 'li', function(event) {
    event.preventDefault();
    const button = $(this);
    const index = button.attr('data-index');
    const getHistory = JSON.parse(localStorage.getItem('getHistory'));
    const city = getHistory[index];

    searchCity(city);
    makeActive(button);
})

function init() {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    if (!searchHistory) {
        searchCity({lat: 34.0522, lon: -118.2437, name: "Los Angeles"});
    } else {
        searchCity(searchHistory[0]);
    }
}

init();

// var APIKey = "82fcfb57b845804458f56e1829f74f3b";                             //create variable to store API key                                              

// var cityInputEl = document.querySelector("#city-input");
// var cityList = document.querySelector("#city-list");
// var todayContainer = document.querySelector("#city-weather-container");
// var forecastContainer = document.querySelector("#forecast-container");
// var buttonElm = document.getElementById("search-city")
// var cities = [];


// function searchCity(city, cityList) {
//     createList(cityList);

//     var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;  //construct a query URL "https://openweathermap.org/current#name" using string concatenation to store the OW current weather data URL and the necessary variables

//     var queryUrlForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;

//     var latitude;                       //will define later
//     var longtitude;

//     $.ajax({
//         url: queryUrl,
//         method: "GET"
//     }).then(function(response){        //store all retrieved data inside an obj called "response"
//         console.log(queryUrl);          //log queryUrl
//         console.log(response);          //log response obj

//         var currentMoment = moment();

//         var displayMoment = $("<h2>");
//         $("#city-name").empty();
//         $("#city-name").append(displayMoment.text("(" + currentMoment.format("MM/DD/YYYY") + ")"));

//         var cityName = $("<h2>").text(response.name);
//         $("#city-name").prepend(cityName);          //add obj before the first child

//         var weatherIcon = $("<img>");
//         weatherIcon.attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png");

//         $("#current-icon").empty();
//         $("#current-icon").append(weatherIcon);

//         $("#current-temp").text("Temperature: " + response.main.temp + " °F");
//         $("#current-humidity").text("Humidity: " + response.main.humidity + " %");
//         $("#current-wind").text("Wind Speed: " + response.wind.speed);

//         latitude = response.coord.lat;
//         longitude = response.coord.lon;
//     })
// };

// function searchCity(city) {
//     var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;  //construct a query URL "https://openweathermap.org/current#name" using string concatenation to store the OW current weather data URL and the necessary variables

//     $.ajax({
//         url: queryUrl,
//         method: "GET"
//     }).then(function (response) {
//         console.log(response);
//         //$("#city-weather-container").empty();                                   //empty the contents of the city-weather-container, append the new city content
//         //var newData =$("<main>");

//         console.log(queryUrl);
//         console.log(response);                                                  //print the object to console
       
//         var city = response.name;
        
//         $(".city").html("<h1>" + city + " Weather Details</h1>");               //construct HTML containing current city information
        
//         $(".temp").text("Temperature(K): " + response.main.temp);

//         $(".humidity").text("Humidity: " + response.main.humidity);


       

//         var windSpeed = response.wind.speed;
//         $(".wind").html("<p>Wind Speed: " + windSpeed + "</p>");

//         var latitude = response.coord.lat;                                      //get UV Index from onecall URL
//         var longtitude = response.coord.lon;
//         function UVIndex(lat, lon) {
//             var lat = latitude;
//             var lon = longtitude;
//             queryUrlUVI = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly" + "&appid=" + APIKey; //URL for UV Index
//             $.ajax({
//                 url: queryUrlUVI,
//                 method: "GET"
//             }).then(function (response) {
//                 console.log(response);
//                 var uvIndex = $("<main>");
//                 $(".UVIndex").append(uvIndex)
//                 uvIndex.text("UV Index: " + response.current.uvi)
//                 console.log("UV Index: " + response.current.uvi);

//                 if (response.current.uvi <= 2){
//                     uvIndex.css({"background-color": "green"})
//                 }else if (response.current.uvi >= 3 && response.current.uvi <= 7){
//                     uvIndex.css({"background-color": "orange"})
//                 }else if (response.current.uvi >= 8 ){
//                     uvIndex.css({"background-color": "red"})
//                 }
//             })
//         }
//         console.log("Temperature(K): " + response.main.temp);
//         console.log("Humidity: " + response.main.humidity);
//         console.log("Wind Speed: " + response.wind.speed);

//         UVIndex();
//     });
// }

// $("#search-button").on("click", function (event) {                              //event handler for user searching the search-city button
//     event.preventDefault();                                                 //prevent the button from trying to submit the request
//     var city = $("#city-input").val().trim();                          //Store the city name

//     searchCity(city, cityList)
//     });







//     searchCity(inputCity);

//     fiveDayForecast(inputCity);                                                    //get the 5 day forecast

//     cities.push(inputCity);                                                  //Add new cityText to cities array, clear the input
//     $("#city-input").value = "";

//     storeCities();
//     renderCityList();
// ;

// function renderCityList() {                                                  //create city list search history
//     cityList.innerHTML = "";

//     for (var i = 0; i < cities.length; i++) {                                //render a new li for each city
//         var city = cities[i];
//         var li = document.createElement("li");
//         li.textContent = city;
//         li.setAttribute("data-index", i);
//         cityList.appendChild(li);
//     }
// }

// function init() {                                                           //store cities from localStorage and retrieve it using getItem
//     var storedCities = JSON.parse(localStorage.getItem("cities"));

//     if (storedCities !== null) {                                            //if cities were retrieved from localStorage, update the cities array
//         cities = storedCities;
//     }
//     renderCityList();
// }

// function storeCities() {                                                    //store an array using localStorage
//     localStorage.setItem("cities", JSON.stringify(cities));
// }

// function fiveDayForecast(city) {
//     $("#1").empty();                                                        //clear history
//     $("#2").empty();
//     $("#3").empty();
//     $("#4").empty();
//     $("#5").empty();

    //var queryUrlForecast = "https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=" + lat + "&lon=" + lon + "&dt={time}" + "&appid=" + APIKey;  //construct a query for retrieving data again
    // var queryUrlForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
    // $.ajax({
    //     url: queryUrlForecast,
    //     method: "GET"
    // }).then(function (response) {
    //     console.log(queryUrlForecast);    
    //     console.log(response);
        //$("#city-weather-container").empty();                                   //empty the contents of the city-weather-container, append the new city content
        //var newData =$("<main>");   

//         str = [1, 2, 3, 4, 5]
//         for (i = 0; i < str.length; i++) {
            

//             var forecastDate = $("<div>");
//             forecastDate.text(moment().add(i + 1, "days").format("MM/DD/YYYY"));
//             $("#" + str[i]).append(forecastDate);


//             var tempForecast = $("<div>");
//             $("#" + str[i]).append(tempForecast);

//             function changeTemp() {                                                  //convert K to °F
//                 var fahrenheit = parseFloat(response.list[i].main.temp);
//                 var convertTemp = Math.round((fahrenheit - 273.15) * (9 / 5) + 32);
//                 tempForecast.text("Temp: " + convertTemp + "°F");
//             }
//             changeTemp();

//             var humidityForecast = $("<div>");                                      // get humidity forecast
//             $("#" + str[i]).append(humidityForecast);
//             humidityForecast.text("Humidity: " + response.list[i].main.humidity);

//             var forecastIcon = document.createElement("img");
//             forecastIcon.setAttribute("src", "https://openweathermap.org/img/w" + response.data.list[i].weather[0].icon + "@2x.png");
//             forecastIcon.setAttribute("alt", response.data.list[i].weather[0].description);
//             $("#" + str[i]).appendChild(forecastIcon);
//         }
//     })
// };










