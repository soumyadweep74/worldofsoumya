async function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    const apiKey = "https://api.openweathermap.org/data/2.5/weather?q=" 
    + city +
    "&appid=1d878dea586c2d8c9d9f92f2189d4ad2&units=metric";

    const response = await fetch(apiKey);
    const data = await response.json();

    if (data.cod === "404") {
        document.getElementById("weatherInfo").innerHTML =
            `<p>City not found ❌</p>`;
        return;
    }

    document.getElementById("weatherInfo").innerHTML = `
        <h2>${data.name}</h2>
        <p>🌡 Temperature: ${data.main.temp}°C</p>
        <p>🌥 Weather: ${data.weather[0].description}</p>
        <p>💨 Wind Speed: ${data.wind.speed} m/s</p>
    `;
}
