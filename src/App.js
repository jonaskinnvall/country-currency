import React, { useState, useEffect } from 'react';

import './styles.css';
import CountryCard from './CountryCard';
import InputField from './InputField';

export default function App() {
    const [Countries, setCountries] = useState();
    const [Search, setSearch] = useState();
    // window.localStorage.clear();

    // UseEffect to fetch country when user types in search field
    useEffect(() => {
        const fetchCountry = async () => {
            try {
                console.log('Fetch');
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
                console.log('Fetching error', err);
            }
        };

        if (Search) {
            if (typeof Storage !== 'undefined') {
                if (
                    typeof window.localStorage.getItem(Search) !==
                        'undefined' &&
                    window.localStorage.getItem(Search) !== null
                ) {
                    setCountries(
                        JSON.parse(window.localStorage.getItem(Search))
                    );
                } else {
                    fetchCountry();
                }
            }
        }
    }, [Search]);

    // UseEffect to add country to local storage on change
    useEffect(() => {
        if (
            (typeof window.localStorage.getItem(Search) === 'undefined' ||
                window.localStorage.getItem(Search) === null) &&
            typeof Countries !== 'undefined'
        ) {
            window.localStorage.setItem(Search, JSON.stringify(Countries));
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
