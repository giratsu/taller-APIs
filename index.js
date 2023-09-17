function forecastDayHTML(dayName, icon, state, max, min, rain, wind, humidity)
{
    return `
    <div class="daily-forecast-element">
    <p>${dayName}</p>
    <div>
    <div>
    <img src="${icon}" width="128" height="128">
    <p>${state}</p>
    </div>
    <div>
    <p>Max: ${max} C°</p>
    <p>Min: ${min} C°</p>
    <p>Rain: ${rain} mm</p>
    <p>Wind: ${wind} Km/h</p>
    <p>H: ${humidity}%</p>
    </div> 
    </div>
    </div>
    `
}

function forecastHourHTML(hour, icon, state, rain, wind, humedity)
{
    return `
    <div class="daily-forecast-element">
    <p>${hour}</p>
    <div>
    <div>
    <img src="${icon}" width="128" height="128">
    <p>${state}</p>
    </div>
    <div>
    <p>Rain: ${rain} %</p>
    <p>Wind: ${wind} Km/h</p>
    <p>H: ${humedity}%</p>
    </div> 
    </div>
    </div>
    `
}

document.addEventListener("DOMContentLoaded", async ev=>{
    const searchParams = new URLSearchParams(window.location.search);
    let query = searchParams.get("q");
    
    const forecastDays = 5;
    const location = document.getElementById("location");
    const mainImage = document.getElementById("main-image")
    const mainTemp = document.getElementById("main-temp");
    const maxTemp = document.getElementById("max-temp");
    const minTemp = document.getElementById("min-temp");
    const rain = document.getElementById("rain");
    const wind = document.getElementById("wind");
    const humidity = document.getElementById("humidity");
    const dailyForecastContainer = document.getElementById("daily-forecast-container");
    const hourlyForecastContainer = document.getElementById("hourly-forecast-container");
    
    if(!query)
    {
        query = await GetCurrentLocation();
    }
    
    let response = await fetch(FORECAST_SEARCH_URL(query, forecastDays + 1, false, false))
    let data = await response.json();
    UpdateScreenData(data);
    
    
    function UpdateScreenData(data)
    {
        location.innerHTML = data.location.name + ", " + data.location.region + ", " + data.location.country;
        mainImage.setAttribute("src", data.current.condition.icon);
        mainTemp.innerHTML = data.current.temp_c + " C°";
        maxTemp.innerHTML = "Max: " + data.forecast.forecastday[0].day.maxtemp_c + " C°";
        minTemp.innerHTML = "Min: " + data.forecast.forecastday[0].day.mintemp_c + "C°";
        rain.innerHTML = "Lluvia: " + data.current.precip_mm + " mm";
        wind.innerHTML = "Viento: " + data.current.wind_kph + " kph";
        humidity.innerHTML = "Humedad: " + data.current.humidity + " %";
        
        // Today Forecast
        for(let i=0; i<data.forecast.forecastday[0].hour.length; i++)
        {
            let currentHour = data.forecast.forecastday[0].hour[i];
            let hourElementHTML = forecastHourHTML(currentHour.time.slice(-5), currentHour.condition.icon, currentHour.condition.text, currentHour.chance_of_rain, currentHour.wind_kph, currentHour.humidity);
            hourlyForecastContainer.innerHTML+=hourElementHTML;
        }
        // 5-day Forecast
        for(let i=1; i<forecastDays+1; i++) // empieza en 1, porque 0 es el día actual y no es relevante.
        {
            let currentDay = data.forecast.forecastday[i];
            let dayElementHTML = forecastDayHTML(currentDay.date, currentDay.day.condition.icon, currentDay.day.condition.text, currentDay.day.maxtemp_c, currentDay.day.mintemp_c, currentDay.day.totalprecip_mm, currentDay.day.maxwind_kph, currentDay.day.avghumidity);
            dailyForecastContainer.innerHTML+=dayElementHTML;
        }
    }
    
    async function GetCurrentLocation() {
        return new Promise((resolve, reject) => {
            // Comprobar si está activada la ubicación en el navegador.
            navigator.geolocation.getCurrentPosition(
                position => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    resolve(lat + " " + lon);
                },
                error => {
                    alert("Error accessing to device location. Showing default location");
                    resolve("34.05 -118.24"); /* zona por defecto: Los Angeles */
                }
            );
        });
    }
    
    
})