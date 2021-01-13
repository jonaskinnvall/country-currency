import React, { useState, useEffect } from "react";
import "./styles.css";
import CountryCard from "./CountryCard";
import InputField from "./InputField";

export default function App() {
  const [Countries, setCountries] = useState();
  const [Search, setSearch] = useState();
console.log("APP")
  // UseEFfect to fetch country when user types in search field
  useEffect(() => {
    const fetchCountry = (country) => {
      fetch(
        "https://restcountries.eu/rest/v2/name/" + country + "?fullText=true"
      )
        .then((response) => response.json())
        .then((data) => setCountries(data))
        .catch((err) => console.log("Fetching error", err));
    };

    if (Search) {
      fetchCountry(Search);
    }
  }, [Search]);

  return (
    <>
      <div className="App Navbar">
        <h1>Country Search</h1>
        <InputField
          inputType={"Search"}
          inputValue={Search}
          setInput={setSearch}
        />
      </div>

      {!Countries ? (
        <div className="App">
          <h2>Search for a country to learn more about it!</h2>
        </div>
      ) : (
        <div className="App">
          <CountryCard countryInfo={Countries[0]} />
        </div>
      )}
    </>
  );
}
