import { useEffect, useState } from 'react'
import weatherProvider from '../services/weatherProvider'

const CountryCard = ({ country }) => {
  const [weather, setWeather] = useState({})

  useEffect(() => {
    weatherProvider.get(country.capital[0]).then(data => {
      setWeather(data)
    })
  }, [])

  return (
    <>
      <h1>{country.name.common} ({country.name.official}) {country.flag}</h1>
      <p>Capital: {country.capital.join(', ')}</p>
      <p>Area: {country.area}</p>

      <h2>Languages</h2>
      <ul>
        {Object.entries(country.languages).map(([key, value]) => <li key={key}>{value}</li>)}
      </ul>

      <img src={country.flags.svg} alt={country.flags.alt} width="400" />

      <h2>Weather in {country.capital[0]}</h2>
      <p>{weather.description}</p>
      <div>Temperature: {weather.temp}</div>
      <div>
        <img src={weather.iconUrl} alt='The weather' />
      </div>
      <div>Wind: {weather.wind}</div>
    </>
  )
}

export default CountryCard