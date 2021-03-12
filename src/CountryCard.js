import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import InputField from './InputField';
import CurrencyGraph from './CurrencyGraph';
import { getLS, setLS } from './useLS';
import './styles.css';

const CountryCard = ({ countryInfo }) => {
    const [AmountSEK, setAmountSEK] = useState();
    const [Currency, setCurrency] = useState();
    const country = useRef(countryInfo);
    const currInLS = useRef(true);

    useEffect(() => {
        // Update useRef and reset AmunotSEK and Currency
        setAmountSEK();
        setCurrency();
        if (country.current !== countryInfo) {
            country.current = countryInfo;
        }
        // Get currency rate from local storage and set AmountSEK to 1
        // to visualize the current rate for 1 SEK
        try {
            getLS(country.current.currencies[0].code, setCurrency);
            currInLS.current = true;
            setAmountSEK('1');
        } catch (err) {
            console.error(err);
            currInLS.current = false;
            setAmountSEK();
        }
    }, [countryInfo]);

    // UseEffect to fetch exchange rate when user has
    // searched for a country and types a value in SEK field
    useEffect(() => {
        const fetchRate = async (amount, targetCurr) => {
            try {
                const response = await fetch(
                    'https://api.exchangerate.host/convert?from=SEK&to=' +
                        targetCurr +
                        '&amount=' +
                        amount
                );
                const newCurrency = await response.json();
                setCurrency(newCurrency.result);
            } catch (err) {
                console.error(err);
            }
        };

        if (AmountSEK && country.current && !currInLS.current) {
            fetchRate(AmountSEK, country.current.currencies[0].code);
        }
        // Set currInLS to false after first render so that
        // fetches for different SEK rates can work
        // currInLS.current = false;
    }, [AmountSEK]);

    // After fetching currency, calculate the rate for 1 SEK and add to local storage
    useEffect(() => {
        let rate = undefined;
        const getRate = () => {
            rate = Currency / AmountSEK;
            rate = rate.toFixed(3);
        };

        if (Currency === undefined || Currency === null) {
            return;
        }

        getRate();
        setLS(country.current.currencies[0].code, rate);
    }, [Currency]);

    return (
        <>
            <div className="countryCard">
                <img className="flag" src={countryInfo.flag} alt="" />
                <div className="columnWidth">
                    <h2>{countryInfo.name}</h2>
                    <p>({countryInfo.nativeName})</p>
                    <p> Part of {countryInfo.region}</p>
                </div>
                <div className="categories columnWidth">
                    <p>Capital: {countryInfo.capital}</p>
                    <p>Population: {countryInfo.population.toLocaleString()}</p>
                    <p>
                        Currency: {countryInfo.currencies[0].name} (
                        {countryInfo.currencies[0].code})
                    </p>
                </div>
                <div>
                    <p>
                        Input value in SEK to get current exchange rate for{' '}
                        {countryInfo.currencies[0].code}:
                    </p>
                    <div className="currencyInput">
                        <div className="columnWidth">
                            <InputField
                                inputType={'SEK'}
                                inputValue={AmountSEK}
                                setInput={setAmountSEK}
                                country={countryInfo}
                            />
                        </div>
                        <div>
                            <p>=</p>
                        </div>
                        {Currency && AmountSEK !== '' ? (
                            <p>
                                {Currency} {countryInfo.currencies[0].code}
                            </p>
                        ) : (
                            <p>{countryInfo.currencies[0].code}</p>
                        )}
                    </div>
                </div>
                <CurrencyGraph currency={countryInfo.currencies[0].code} />
            </div>
        </>
    );
};

export default CountryCard;

CountryCard.propTypes = {
    countryInfo: PropTypes.object,
};
