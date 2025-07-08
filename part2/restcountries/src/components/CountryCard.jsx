const CountryCard = ({ country }) => {
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
    </>
  )
}

export default CountryCard