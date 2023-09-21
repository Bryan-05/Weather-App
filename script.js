const searchButton = document.querySelector(".search-btn");
const searchInput = document.querySelector(".location-input");
const locationButton = document.querySelector(".current-location-btn")
const currentWeatherDiv = document.querySelector(".weather-display");
const weatherCardsDiv = document.querySelector(".forecast-cards");

// You must use your own API key from openweathermap.org
const API_KEY = "Your API key here";

const createWeatherCard = (locationName, weatherItem, index) => {
    if (index === 0) {
        return `<div class="details">
                    <h2>${locationName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${(((weatherItem.main.temp - 273.15) * 9/5) + 32).toFixed(2)}&deg;F</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    }
    else{
        return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather icon">
                    <h4>Temperature: ${(((weatherItem.main.temp - 273.15) * 9/5) + 32).toFixed(2)}&deg;F</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </li>`;
    }
}

const getWeatherDetails = (locationName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        //Clear previous weather data
        searchInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";


        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach((weatherItem, index) => {
            if (index === 0){
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(locationName, weatherItem, index));
            }
            else{
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(locationName, weatherItem, index));
            }
        });
    }).catch(() => {
        alert("Error while fetching forecast.")
    });
}

const getLocation = () => {
    const locationName = searchInput.value.trim();
    if (!locationName) return;
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if (!data.length) return alert(`No location found for ${locationName}`);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("Error while finding location.");
    });
}

const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const {latitude, longitude} = position.coords;
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert("Error while finding location.");
            });
        },
        error => {
            if(error.code === error.PERMISSION_DENIED) {
                alert("Current location request denied.");
            }
        }
    );
}

locationButton.addEventListener("click", getUserLocation);
searchButton.addEventListener("click", getLocation);
searchInput.addEventListener("keyup", e => e.key === "Enter" && getLocation());