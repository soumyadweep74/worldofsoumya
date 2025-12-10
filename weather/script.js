const apiKey = "d0b5a1b132b80a05dd9af971bc43e60d";

function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const info = document.getElementById("weatherInfo");

    if(city === "") {
        info.innerHTML = `<p class="error">Please enter a city name! ⚠️</p>`;
        return;
    }

    info.innerHTML = `<p class="loading">Fetching weather... 🌦️</p>`;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => {
            if(!response.ok) throw new Error("City not found");
            return response.json();
        })
        .then(data => {
            info.innerHTML = `
                <h2>${data.name}, ${data.sys.country}</h2>
                <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
                <p><strong>Weather:</strong> ${data.weather[0].main} - ${data.weather[0].description}</p>
                <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
            `;
        })
        .catch(err => {
            info.innerHTML = `<p class="error">City not found. Try again! ❌</p>`;
            console.error(err);
        });
}

// Enable Enter key to search
document.getElementById("cityInput").addEventListener("keyup", function(event) {
    if(event.key === "Enter") {
        getWeather();
    }
});
