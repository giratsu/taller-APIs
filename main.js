const API_KEY = "3b7059de942c47ddbb9215559230909";
const FORECAST_URL = "http://api.weatherapi.com/v1/forecast.json?key=";
const SEARCH_URL = "https://api.weatherapi.com/v1/search.json?key=";

function FORECAST_SEARCH_URL(query, forecastDays, airQuality, alerts)
{
    const PARAMS = `&q=${query}&days=${forecastDays}&aqi=${airQuality?"yes":"no"}&alerts${alerts?"yes":"no"}`;
    return FORECAST_URL+API_KEY+PARAMS;
}

function RESULTS_SEARCH_URL(query)
{
    const PARAMS = `&q=${query}`
    return SEARCH_URL+API_KEY+PARAMS;
}