import { useState, useEffect } from "react"
import countryProvider from './services/countryProvider'
import SearchResult from "./components/SearchResult"

const App = () => {
  const [searchText, setSearchText] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [countriesToShow, setCountriesToShow] = useState([])

  useEffect(() => {
    countryProvider.getAll().then(data => {
      setAllCountries(data)
    })
  }, [])

  const filterCountries = (text, countries) => {
    return countries.filter(country => country.name.common.toLowerCase().includes(text.toLowerCase()))
  }

  const handleSearchTextChange = (e) => {
    const newSearchText = e.target.value
    setSearchText(newSearchText)
    setCountriesToShow(filterCountries(newSearchText, allCountries))
  }

  return (
    <div>
      find countries <input onChange={handleSearchTextChange} value={searchText} />
      <SearchResult countries={countriesToShow} text={searchText} updateSearchText={setSearchText} />
    </div>
  )
}

export default App