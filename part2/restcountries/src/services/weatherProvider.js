import axios from "axios"

const api_key = import.meta.env.VITE_WEATHER_API
const geoCodingBaseUrl = "http://api.openweathermap.org/geo/1.0"
const weatherBaseUrl = "https://api.openweathermap.org/data/2.5"

const get = (city) => {
  return axios.get(`${geoCodingBaseUrl}/direct?q=${city}&limit=1&appid=${api_key}`)
    .then(response => {
      const lat = response.data[0].lat
      const lon = response.data[0].lon

      return axios.get(`${weatherBaseUrl}/weather?lat=${lat}&lon=${lon}&appid=${api_key}`)
    })
    .then(response => {
      const weatherData = {
        temp: `${(response.data.main.temp - 273.15).toFixed(1)} \u2103`,
        wind: `${response.data.wind.speed} m/s`,
        description: response.data.weather[0].description,
        iconUrl: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@4x.png`
      }

      return weatherData
    })
    .catch(error => {
      console.error(error)
    })
}

export default { get }