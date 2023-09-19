const searchButton = document.querySelector(".search-btn");
const searchInput = document.querySelector(".location-input");

const API_KEY = "Removed";

const createWeatherCard = (weatherItem) => {
    return `<li class="card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="https://openweathermap.org/img/wn/10d@4x.png" alt="Sunny">
                <h4>Temperature: 85&deg;F</h4>
                <h4>Wind: 2.00 mph S</h4>
                <h4>Humidity: 75%</h4>
            </li>`;
}

const getWeatherDetails = (locationName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        console.log(data);

        const uniqueForecastDays = [];

        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach(weatherItem => {
            createWeatherCard(weatherItem);
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
        getWeatherDetails(name, lat, lon)
    }).catch(() => {
        alert("Error while finding location.")
    });
}

searchButton.addEventListener("click", getLocation);