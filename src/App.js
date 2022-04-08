import React, { useState, useEffect, useRef } from 'react';
import { DateTime } from 'luxon';

import './styles.css';
import CountryCard from './CountryCard';
import InputField from './InputField';

async function fetchCountry(query) {
    const cache = localStorage.getItem(query);
    if (cache) {
        return JSON.parse(cache);
    }

    const response = await fetch(
        'https://restcountries.com/v2/name/' + query + '?fullText=true'
    );
    if (response.ok) {
        const data = await response.json();
        localStorage.setItem(query, JSON.stringify(data));
        return data;
    }
    throw Error(`Request rejected with status ${response.status}`);
}

export default function App() {
    const [country, setCountry] = useState();
    const [search, setSearch] = useState();
    const [error, setError] = useState();
    const today = DateTime.now();
    const inputRef = useRef('');

    if (today.toISODate() !== JSON.parse(localStorage.getItem('date'))) {
        localStorage.clear();
        localStorage.setItem('date', JSON.stringify(today.toISODate()));
    }

    // UseEffect to fetch country when user types in search field
    useEffect(() => {
        if (search) {
            setError(null);
            fetchCountry(search).then(
                (country) => {
                    setCountry(country[0]);
                    if (inputRef.current !== '') {
                        inputRef.current.value = '';
                    }
                },
                (error) => {
                    setError(error.message);
                }
            );
        }
    }, [search]);

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
                    <CountryCard
                        countryInfo={country}
                        today={today}
                        ref={inputRef}
                    />
                </div>
            )}
        </>
    );
}
