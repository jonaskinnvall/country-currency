import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import InputField from './InputField';
import './styles.css';

const CountryCard = ({ countryInfo }) => {
    const [AmountSEK, setAmountSEK] = useState();
    const [Currency, setCurrency] = useState();
    const country = useRef(countryInfo);
    const currInLS = useRef(false);

    // Update useRef
    useEffect(() => {
        console.log('Ref use');

        if (country.current !== countryInfo) {
            console.log('Change ref');
            country.current = countryInfo;
            currInLS.current = false;
        }
        setAmountSEK();
        setCurrency();
    }, [countryInfo]);

    // UseEffect to fetch exchange rate when user has
    // searched for a country and types a value in SEK field
    useEffect(() => {
        const fetchRate = async (amount, targetCurr) => {
            try {
                console.log('Fetch Curr');
                const response = await fetch(
                    'https://api.exchangerate.host/convert?from=SEK&to=' +
                        targetCurr +
                        '&amount=' +
                        amount
                );
                const newCurrency = await response.json();
                setCurrency(newCurrency);
            } catch (err) {
                console.log('Fetching error', err);
            }
        };

        if (AmountSEK && country && !currInLS.current) {
            console.log('Call Fetch');
            fetchRate(AmountSEK, country.current.currencies[0].code);
        }
    }, [AmountSEK]);

    // After fetching currency, calculate the rate for 1 SEK and add to local storage
    useEffect(() => {
        let rate = undefined;
        const getRate = () => {
            rate = Currency.result / AmountSEK;
            rate.toFixed(5);
        };

        if (Currency === undefined || Currency === null) {
            return;
        }

        if (
            typeof window.localStorage.getItem(
                country.current.currencies[0].code
            ) === 'undefined' ||
            window.localStorage.getItem(country.current.currencies[0].code) ===
                null
        ) {
            console.log('Get rate and set LS');
            getRate();

            window.localStorage.setItem(
                country.current.currencies[0].code,
                rate
            );
        }
    }, [Currency]);

    // Get currency rate from local storage and set AmountSEK to 1
    // to visualize the current rate for 1 SEK
    useEffect(() => {
        if (
            typeof window.localStorage.getItem(
                country.current.currencies[0].code
            ) !== 'undefined' &&
            window.localStorage.getItem(country.current.currencies[0].code) !==
                null
        ) {
            console.log('Set amount 1 and get curr');

            currInLS.current = true;
            setAmountSEK('1');
            setCurrency({
                result: window.localStorage.getItem(
                    country.current.currencies[0].code
                ),
            });
        }
    }, [countryInfo]);

    return (
        <>
            <div className="countryCard">
                <img className="flag" src={countryInfo.flag} alt="" />
                <div className="columnWidth">
                    <h1>{countryInfo.name}</h1>
                    <h3>({countryInfo.nativeName})</h3>
                    <h3> Part of {countryInfo.region}</h3>
                </div>
                <div className="categories columnWidth">
                    <h3>Capital: {countryInfo.capital}</h3>
                    <h3>
                        Population: {countryInfo.population.toLocaleString()}
                    </h3>
                    <h3>
                        Currency: {countryInfo.currencies[0].name} (
                        {countryInfo.currencies[0].code})
                    </h3>
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
                            />
                        </div>
                        <div>
                            <p>=</p>
                        </div>
                        {Currency && AmountSEK !== '' ? (
                            <p>
                                {Currency.result}{' '}
                                {countryInfo.currencies[0].code}
                            </p>
                        ) : (
                            <p>{countryInfo.currencies[0].code}</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CountryCard;

CountryCard.propTypes = {
    countryInfo: PropTypes.object,
};
