import React, { useState, useEffect } from 'react'
import axios from 'axios'

const CountrySearch = ({ searchEventHandler}) => (
  <div>
    find countries <input onChange={searchEventHandler} />
  </div>
)

const CountryDetail = ({ country, weather, setWeather}) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>
        capital {country.capital}<br />
        population {country.population}
      </div>
      <h3>languages</h3>
      <div>
        <ul>
          {Object.values(country.languages).map(x => <li key={x}>{x}</li>)}
        </ul>
      </div>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
      <Weather city={country.capital} weather={weather} setWeather={setWeather} />
    </div>
  )
}

const CountryResultItem = ({ country, onClickHandler }) => {
  return (
    <div>
      {country.name.common}
      <button onClick={() => onClickHandler(country.name.common)}>show</button>
    </div>
  )
}

const Weather = ({city, weather, setWeather}) => {
  const api_key = process.env.REACT_APP_API_KEY
  useEffect(() => {
    axios
      .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${city}`)
      .then(response => {
        console.log(response.data)
        const res = response.data.current
        setWeather({
          temperature: res.temperature,
          wind: `${res.wind_speed} mph direction ${res.wind_dir}`,
          icon: res.weather_icons[0]
        })
      })
  }, [api_key, city, setWeather])
  return (
    <div>
      <h3>Weather in {city}</h3>
      <b>temperature:</b> {weather.temperature}<br />
      <img src={weather.icon} alt={`Weather in ${city}`} /><br />
      <b>wind:</b> {weather.wind}
    </div>
  )
}

const CountryResults = ({allCountries, searchTerm, onClickHandler, weather, setWeather}) => {
  const filteredCountries = allCountries.filter(
    x => x.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  )
  if (searchTerm === '') {
    return ''
  }
  else if (filteredCountries.length === 1) {
    return <CountryDetail country={filteredCountries[0]} weather={weather} setWeather={setWeather} />
  }
  else if (filteredCountries.length < 10) {
    return filteredCountries.map(c => <CountryResultItem key={c.ccn3} country={c} onClickHandler={onClickHandler}/>)
  }
  else {
    return <div>Too many matches, specify another filter</div>
  }
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [weather, setWeather] = useState({})

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
    <CountryResults 
      allCountries={countries}
      searchTerm={searchTerm}
      onClickHandler={setSearchTerm}
      weather={weather}
      setWeather={setWeather}
    />
    </>
  )
}

export default App