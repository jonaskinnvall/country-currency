import React, { useState, useEffect } from 'react';

import './styles.css';
import CountryCard from './CountryCard';
import InputField from './InputField';

import { setLS, getLS } from './useLS';

export default function App() {
    const [Countries, setCountries] = useState();
    const [Search, setSearch] = useState();
    // window.localStorage.clear();

    // UseEffect to fetch country when user types in search field
    useEffect(() => {
        const fetchCountry = async () => {
            try {
                const response = await fetch(
                    'https://restcountries.eu/rest/v2/name/' +
                        Search +
                        '?fullText=true'
                );
                const newCountry = await response.json();
                if (
                    Object.prototype.toString.call(newCountry) ===
                    '[object Array]'
                ) {
                    setCountries(newCountry);
                } else {
                    setCountries();
                }
            } catch (err) {
                console.error(err);
            }
        };

        if (Search) {
            try {
                getLS(Search, setCountries);
            } catch (err) {
                fetchCountry();
            }
        }
    }, [Search]);

    // UseEffect to add country to local storage on change
    useEffect(() => {
        if (typeof Countries !== 'undefined') {
            setLS(Search, Countries);
        }
    }, [Countries]);

    return (
        <>
            <div className="App Navbar">
                <h1>Country Search</h1>
                <InputField
                    inputType={'Search'}
                    inputValue={Search}
                    setInput={setSearch}
                />
            </div>

            {Search && !Countries ? (
                <div className="App">
                    <h2>
                        Fetching error... No country with matching name or
                        country code. Please try again.
                    </h2>
                </div>
            ) : !Countries ? (
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
