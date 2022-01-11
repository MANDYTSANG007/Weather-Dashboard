var APIKey = "82fcfb57b845804458f56e1829f74f3b"; //create variable to store API key
var city="Los Angeles";                         //create variable to store user input for the city
var queryUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;  //construct a query URL "https://openweathermap.org/current#name" using string concatenation to store the OW current weather data URL and the necessary variables
var searchInputEl = document.querySelector("#searchBar");
var todayContainer = document.querySelector("#today-city-weather-container");
var forcastContainer = document.querySelector("#forcast-container");
var buttonElm = document.getElementById("search")

//Request for data from OpenWeather API
fetch(queryUrl)                                 //call the Fetch API to pass the query/request URL in as a parameter
    .then(function(response){
        return response.json();                 //the original response is from http, we use json()to extract that response
    })
    .then(function(data){                       //need to do something to the data
        console.log(data);
        var list = data.list;                   //get a list from the data

        for(var item of list){
            var main = item.main;
            var temp = main.temp;
            var day = item.dt_txt;
        }
    });

// to retrieve user input from the text box
/*var searchBar = document.getElementById("searchBar"); 
searchBar = addEventListener("keyup", e =>{//add a keyup event listener to retrieve the input, use arrow function for the callback, this callback function has a parameter e, the event object.
    var searchString = e.target.value; //
}); 
console.log(searchString);*/






/*GIVEN a weather dashboard with form inputs
WHEN I search for a city
    -create a user input
    -create a button for users to submit a search
        -getElementById("button")
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
*/