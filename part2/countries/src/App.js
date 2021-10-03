import React, { useState, useEffect } from 'react'
import axios from 'axios'

const CountrySearch = ({ searchEventHandler}) => (
  <div>
    find countries <input onChange={searchEventHandler} />
  </div>
)

const CountryDetail = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>
        capital {country.capital}
        population {country.population}
      </div>
      <h3>languages</h3>
      <div>
        <ul>
          {Object.values(country.languages).map(x => <li key={x}>{x}</li>)}
        </ul>
      </div>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
    </div>
  )
}

const CountryResults = ({ allCountries, searchTerm }) => {
  const filteredCountries = allCountries.filter(
    x => x.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  )
  if (searchTerm === '') {
    return ''
  }
  else if (filteredCountries.length === 1) {
    return <CountryDetail country={filteredCountries[0]}/>
  }
  else if (filteredCountries.length < 10) {
    return filteredCountries.map(c => <div key={c.ccn3}>{c.name.common}</div>)
  }
  else {
    return <div>Too many matches, specify another filter</div>
  }
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        const countries = response.data
        setCountries(countries)
        console.log(countries)
      })
  }, [])

  const searchEventHandler = (event) => setSearchTerm(event.target.value)

  return (
    <>
    <CountrySearch searchEventHandler={searchEventHandler} />
    <CountryResults allCountries={countries} searchTerm={searchTerm} />
    </>
  )
}

export default App