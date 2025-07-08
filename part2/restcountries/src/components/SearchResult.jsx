import CountryCard from "./CountryCard"

const SearchResult = ({ countries, text }) => {
  if (countries.length === 0) {
    return <p>No country found</p>
  }
  
  if (countries.length === 1) {
    return <CountryCard country={countries[0]} />
  }

  if (countries.length <= 10) {
    const exactMatch = countries.find(country => country.name.common.toLowerCase() === text.toLowerCase())
    if (exactMatch) {
      return <CountryCard country={exactMatch} />
    }
    
    return (
      <>
        {countries.map(country => 
          <div key={country.cca2}>{country.name.common}</div>
        )}
      </>
    )
  }

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }
}

export default SearchResult