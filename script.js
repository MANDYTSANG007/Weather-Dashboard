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

    $('#get-history').html(''); //get the HTML contents of the first element in the set of matched elements
    $.each(getHistory, function(i, input) {
        const $btn = $('<input type="button" value="delete" key="'+key+'" class="btn btn-outline-secondary" id="delete"/>');

        const li = $('<li>').append(input.name, $btn);

        li.attr('class', 'list-group-item'); //gets the attribute value for only the first element in the matched set.
        li.attr('data-index', i);
        $('#get-history').append(li);
    })
    makeActive($('#get-history :first-child')); //:first-child selector can match more than one: one for each parent.

    if (window.localStorage) {
        var key, value;
        for (var i=0; i<localStorage.length; i++) {
            key = localStorage.key(i);
            value = localStorage.getItem(key);
        }
    }

    $('#get-history').on('click', '#delete', function(el) {
        localStorage.setItem(key, value);
        const getHistory = JSON.parse(localStorage.getItem('getHistory'));
        $(this).closest('li').remove();
        var key = $(this).attr('key');
        localStorage.removeItem(key);
        // $('#get-history').listview('refresh');
        // getHistory = getHistory.filter(entry => (entry.name != key));
        localStorage.setItem('getHistory', JSON.stringify(getHistory));
    })
}

//click on the city to display the city's weather data 
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









