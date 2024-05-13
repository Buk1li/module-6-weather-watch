const apiKey = 'd2fae8857d4b322190a31fdc54600ac0';

// Function to fetch and display weather information
function getWeather() {
    const cityName = document.getElementById('cityInput').value;
    const currentWeatherContainer = document.getElementById('current-weather-container');
    const forecastContainer = document.getElementById('forecast-container');

    // Clear previous weather information
    currentWeatherContainer.innerHTML = '';
    forecastContainer.innerHTML = '';

    // Fetch current weather data
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            // Extract current weather data
            const curTemperature = data.main.temp;
            const curWindSpeed = data.wind.speed;
            const curHumidity = data.main.humidity;
            const curWeatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

            // Populate current weather card with data
            currentWeatherContainer.innerHTML += `
                <div class="weather-card current-weather-card">
                    <img src="${curWeatherIcon}" alt="Weather Icon">
                    <h3>${cityName}</h3>
                    <p>Temperature: ${curTemperature} °F</p>
                    <p>Wind Speed: ${curWindSpeed} m/s</p>
                    <p>Humidity: ${curHumidity}%</p>
                </div>
            `;

            // Save search to local storage
            saveToLocalStorage(cityName);
        })
        .catch(error => console.log('Error fetching current weather data:', error));

    // Fetch weather forecast data for the next 5 days
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&cnt=40&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            // Extract forecasts for each day
            const forecastByDay = {};
            data.list.forEach(forecast => {
                const date = new Date(forecast.dt_txt);
                const day = date.toLocaleDateString(undefined, { weekday: 'long' });
                if (!forecastByDay[day]) {
                    forecastByDay[day] = forecast;
                }
            });

            // Iterate through forecast data for each day
            Object.keys(forecastByDay).forEach(day => {
                const forecast = forecastByDay[day];
                const date = new Date(forecast.dt_txt);
                const formattedDate = date.toLocaleDateString('en-US');
                const temperature = forecast.main.temp;
                const weatherIcon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
                const windSpeed = forecast.wind.speed;
                const humidity = forecast.main.humidity;

                // Populate forecast card with data
                forecastContainer.innerHTML += `
                    <div class="weather-card forecast-card">
                        <h2>${formattedDate}</h2>
                        <img src="${weatherIcon}" alt="Weather Icon">
                        <p>Temperature: ${temperature} °F</p>
                        <p>Wind Speed: ${windSpeed} m/s</p>
                        <p>Humidity: ${humidity}%</p>
                    </div>
                `;
            });
        })
        .catch(error => console.log('Error fetching weather forecast data:', error));
}

// Function to save search history to local storage
function saveToLocalStorage(cityName) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.unshift(cityName);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.slice(0, 5))); // Limit search history to 5 entries
    renderSearchHistory();
}

// Function to render search history in the UI
function renderSearchHistory() {
    const searchHistoryContainer = document.getElementById('search-history');
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistoryContainer.innerHTML = '';
    searchHistory.forEach(city => {
        const historyItem = document.createElement('div');
        historyItem.textContent = city;
        historyItem.classList.add('search-history-item');
        historyItem.addEventListener('click', () => {
            document.getElementById('cityInput').value = city;
            getWeather();
        });
        searchHistoryContainer.appendChild(historyItem);
    });
}

// Call renderSearchHistory() when the page loads to display existing search history
window.addEventListener('load', renderSearchHistory);