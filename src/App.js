import React, { useState, useEffect, useRef } from 'react';

import './styles.css';
import CountryCard from './CountryCard';
import InputField from './InputField';

import { setLS, getLS } from './LS';

export default function App() {
    const [country, setCountry] = useState();
    const [search, setSearch] = useState();
    const [error, setError] = useState();
    const searchString = useRef('');
    // window.localStorage.clear();

    // UseEffect to fetch country when user types in search field
    useEffect(() => {
        const fetchCountry = async () => {
            try {
                const response = await fetch(
                    'https://restcountries.eu/rest/v2/name/' +
                        search +
                        '?fullText=true'
                );
                if (response.ok) {
                    const newCountry = await response.json();
                    setCountry(newCountry[0]);
                } else {
                    setCountry();
                    throw Error(
                        `Request rejected with status ${response.status}`
                    );
                }
            } catch (err) {
                setError(err.message);
            }
        };

        if (searchString.current !== search) {
            searchString.current = search;
            setError();
        }
        if (search) {
            try {
                getLS(search, setCountry);
            } catch (err) {
                fetchCountry();
            }
        }
    }, [search]);

    // UseEffect to add country to local storage on change
    useEffect(() => {
        if (typeof Countries !== 'undefined') {
            setLS(searchString.current, country);
        }
    }, [country]);

    return (
        <>
            <div className="App Navbar">
                <h1>Country Currency</h1>
                <InputField
                    inputType={'Search'}
                    inputValue={search}
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
            ) : !country ? (
                <div className="App">
                    <h2>Search for a country to learn more about it!</h2>
                </div>
            ) : (
                <div className="App">
                    <CountryCard countryInfo={country} />
                </div>
            )}
        </>
    );
}
