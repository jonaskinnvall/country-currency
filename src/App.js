import React, { useState, useEffect, useRef } from 'react';

import './styles.css';
import CountryCard from './CountryCard';
import InputField from './InputField';

import { setLS, getLS } from './useLS';

export default function App() {
    const [Countries, setCountries] = useState();
    const [Search, setSearch] = useState();
    const [error, setError] = useState();
    const searchString = useRef('');
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
                if (response.ok) {
                    const newCountry = await response.json();
                    setCountries(newCountry[0]);
                } else {
                    setCountries();
                    throw Error(
                        `Request rejected with status ${response.status}`
                    );
                }
            } catch (err) {
                setError(err.message);
            }
        };

        if (searchString.current !== Search) {
            searchString.current = Search;
            setError();
        }
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
            setLS(searchString.current, Countries);
        }
    }, [Countries]);

    return (
        <>
            <div className="App Navbar">
                <h1>Country Currency</h1>
                <InputField
                    inputType={'Search'}
                    inputValue={Search}
                    setInput={setSearch}
                />
            </div>

            {error ? (
                <div className="App">
                    <h2>
                        Fetching error...{error} <br />
                        Country name or country code not available. Please try
                        another.
                    </h2>
                </div>
            ) : !Countries ? (
                <div className="App">
                    <h2>Search for a country to learn more about it!</h2>
                </div>
            ) : (
                <div className="App">
                    <CountryCard countryInfo={Countries} />
                </div>
            )}
        </>
    );
}
