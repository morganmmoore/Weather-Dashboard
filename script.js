var formEl = document.querySelector('#user-form');
var cityInputEl = document.querySelector("#city");
var cityContainerEl = document.querySelector('#city-container');
var cities = document.querySelector('.cities');
var searchCities = [];


var APIKey = 'bca641a09704d6a343b2de6d50d05813';

showUserInput();

var formSubmitHandler = function(event) {
    event.preventDefault();
    //clearWeather();

    var cityEl = cityInputEl.value.trim();
    var card = document.getElementsByClassName('card');
    

    for (i = 0; i < card.length; i++) {
        card[i].style.border = 'solid black 1px';
    }

    if (cityEl) {
        getWeather(cityEl);
    }

    buildCityList(cityEl);
    saveUserInput(searchCities);
}

function buildCityList(cityEl) {

    var citiesList = cities.getElementsByTagName('li');
    var inList = false;

    for (i = 0; i < citiesList.length; i++) {
        if (citiesList[i].firstChild.innerHTML == cityEl) {
            inList = true;
        }
    } if (inList == false) {
        var cityLi = document.createElement('li');
        var cityButton = document.createElement('button');

        cityButton.innerHTML = cityEl;
        searchCities.push(cityEl);
        cityLi.appendChild(cityButton);
        cities.appendChild(cityLi);
    }
}

function saveUserInput(cityArray) {
    localStorage.setItem('city', JSON.stringify(cityArray));
    console.log(localStorage.getItem('city'));
}

function showUserInput() {
    var data = localStorage.getItem('city');
    var savedCity = JSON.parse(data);
    if (savedCity != null) {
        if (savedCity.length > 0) {
            for (i = 0; i < savedCity.length; i++) {
                buildCityList(savedCity[i]);
            }
        }
    }
}

// var clearWeather = function() {
//     while (weatherCard.firstChild) {
//         weatherCard.removeChild(weatherCard.lastChild);
//     }
// }

var getWeather = function (city) {
    var apiURL ='https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=' + APIKey;

     fetch(apiURL).then(function (response) {    
         if (response.ok) {
         //console.log(response);
         response.json().then(function (data) {
             console.log(data);
          displayWeather(data, city);
             });
         } 
    })
};

var displayWeather = function (data, cityName) {

    var weatherCard = document.createElement('div');
    weatherCard.setAttribute('id', 'weatherCard');
    weatherCard.setAttribute('class', 'card-body');
    var weatherIcon = document.createElement('img');
    weatherIcon.src = 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'
    var weatherTitle = document.createElement('h3');
    weatherTitle.setAttribute('class', 'card-title');
    weatherTitle.textContent = cityName;
    var weatherTemp = document.createElement('p');
    weatherTemp.setAttribute('class', 'card-text');
    weatherTemp.textContent = 'Temp: ' + data.main.temp + ' F';
    var weatherHumidity = document.createElement('p');
    weatherHumidity.setAttribute('class', 'card-text');
    weatherHumidity.textContent = 'Humidity: ' + data.main.humidity + ' %';
    var windSpeed = document.createElement('p');
    windSpeed.setAttribute('class', 'card-text');
    windSpeed.textContent = 'Wind Speed: ' + data.wind.speed + ' MPH';

    weatherTitle.appendChild(weatherIcon);
    weatherCard.appendChild(weatherTitle);
    weatherCard.appendChild(weatherTemp);
    weatherCard.appendChild(weatherHumidity);
    weatherCard.appendChild(windSpeed);

    var weatherEl = document.getElementById('current-weather');
    weatherEl.appendChild(weatherCard);

    fiveDayForecast(data.coord.lat, data.coord.lon);
}

var fiveDayForecast = function(lat, lon) {
    var fiveDayURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + APIKey;

    fetch(fiveDayURL).then(function(response) {
        return response.json();
    }) .then(function(data) {
        console.log(data);
        getUVI(data.current.uvi);

        var fiveDayEl = document.getElementById('five-day');
        var weather = data.daily;

        for (var i = 0; i < 5; i++) {

            var weatherEl = document.createElement('div');
            var titleEl = document.createElement('div');
            titleEl.setAttribute('id', 'newDate');
            titleEl.setAttribute('class', 'card');
            titleEl.textContent = new Date(weather[i].sunrise * 1000).toLocaleDateString();
            var weatherIcon = document.createElement('img');
            weatherIcon.src = 'http://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '@2x.png'
            var weatherTemp = document.createElement('p');
            weatherTemp.setAttribute('class', 'card-text');
            weatherTemp.textContent = 'Temp: ' + data.daily[i].temp.day  + ' F';
            var weatherHumidity = document.createElement('p');
            weatherHumidity.setAttribute('class', 'card-text');
            weatherHumidity.textContent = 'Humidity: ' + data.daily[i].humidity + ' %';
            var windSpeed = document.createElement('p');
            windSpeed.setAttribute('class', 'card-text');
            windSpeed.textContent = 'Wind Speed: ' + data.daily[i].wind_speed + ' MPH';

            titleEl.appendChild(weatherIcon);
            titleEl.appendChild(weatherTemp);
            titleEl.appendChild(weatherHumidity);
            titleEl.appendChild(windSpeed);
            weatherEl.appendChild(titleEl);
            fiveDayEl.appendChild(weatherEl);
        }
    }) .catch(function(err) {
        console.log(err);
    })
}

var getUVI = function(uvi) {
    console.log(uvi);
    var weatherCard = document.getElementById('weatherCard');
    var UvDiv = document.createElement('div');
    UvDiv.style.display = 'flex';
    var weatherUVI = document.createElement('p');
    var weatherUviVal = document.createElement('p');
    weatherUviVal.setAttribute('class', 'UvBox');
    weatherUVI.setAttribute('class', 'dailyUVI');
    weatherUVI.textContent = 'UVI: ';
    weatherUviVal.textContent = uvi;

    if (uvi <= 3) {
        weatherUviVal.style.color = 'white';
        weatherUviVal.style.backgroundColor = 'green';
    }
    if (3 < uvi && uvi <= 7) {
        weatherUviVal.style.color = 'white';
        weatherUviVal.style.backgroundColor = 'orange';
    }
    if (uvi > 7) {
        weatherUviVal.style.color = 'white';
        weatherUviVal.style.backgroundColor = 'red';
    }

    UvDiv.append(weatherUVI);
    UvDiv.append(weatherUviVal);
    weatherCard.append(UvDiv);
}

formEl.addEventListener("submit", formSubmitHandler);
