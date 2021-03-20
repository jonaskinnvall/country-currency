import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import InputField from './InputField';
import CurrencyGraph from './CurrencyGraph';
import { getLS, setLS } from './LS';
import './styles.css';

const CountryCard = ({ countryInfo, today }) => {
    const initialDate = useRef(today.minus({ week: 1 }).toISODate());
    const endDate = useRef(today.toISODate());

    const [error, setError] = useState();
    const [amountSEK, setAmountSEK] = useState();
    const [currency, setCurrency] = useState();
    const [startDate, setStart] = useState({
        date: initialDate.current,
        type: '1week',
    });
    const country = useRef(countryInfo);
    const currInLS = useRef(true);

    useEffect(() => {
        // Update useRef and reset AmunotSEK and Currency

        if (country.current !== countryInfo) {
            country.current = countryInfo;
            setError();
            setAmountSEK();
            setCurrency();
        }
        // Get currency rate from local storage and set AmountSEK to 1
        // to visualize the current rate for 1 SEK
        try {
            getLS(country.current.currencies[0].code, setCurrency);
            currInLS.current = true;
            setAmountSEK('1');
        } catch (err) {
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
                if (response.ok) {
                    const newCurrency = await response.json();
                    setCurrency(newCurrency.result);
                } else {
                    setCurrency();
                    throw Error(
                        `Request rejected with status ${response.status}`
                    );
                }
            } catch (err) {
                setError(err.message);
            }
        };

        if (amountSEK && country.current && !currInLS.current) {
            fetchRate(amountSEK, country.current.currencies[0].code);
        }
        // Set currInLS to false after first render so that
        // fetches for different SEK rates can work
        // currInLS.current = false;
    }, [amountSEK, setError]);

    // After fetching currency, calculate the rate for 1 SEK and add to local storage
    useEffect(() => {
        let rate = undefined;
        const getRate = () => {
            rate = currency / amountSEK;
            rate = rate.toFixed(3);
        };

        if (currency === undefined || currency === null) {
            return;
        }

        getRate();
        setLS(country.current.currencies[0].code, rate);
    }, [currency, amountSEK]);

    const rateInterval = (interval, amount) => {
        if (interval === 'month') {
            setStart({
                date: today.minus({ month: amount }).toISODate(),
                type: amount + interval,
            });
        } else if (interval === 'week') {
            setStart({
                date: today.minus({ week: amount }).toISODate(),
                type: amount + interval,
            });
        } else {
            setStart({
                date: today.minus({ year: amount }).toISODate(),
                type: amount + interval,
            });
        }
    };

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
                                inputValue={amountSEK}
                                setInput={setAmountSEK}
                                country={countryInfo}
                            />
                        </div>
                        <div>
                            <p>=</p>
                        </div>
                        {error ? (
                            <p> {error} Could not fetch currency rate</p>
                        ) : currency && amountSEK !== '' ? (
                            <p>
                                {currency} {countryInfo.currencies[0].code}
                            </p>
                        ) : (
                            <p>{countryInfo.currencies[0].code}</p>
                        )}
                    </div>
                </div>
                <CurrencyGraph
                    currency={countryInfo.currencies[0].code}
                    startDate={startDate}
                    endDate={endDate.current}
                />
                <div className="tab">
                    <button onClick={() => rateInterval('week', 1)}>
                        1 week
                    </button>
                    <button onClick={() => rateInterval('month', 1)}>
                        1 month
                    </button>
                    <button onClick={() => rateInterval('month', 3)}>
                        3 months
                    </button>
                </div>
            </div>
        </>
    );
};

export default CountryCard;

CountryCard.propTypes = {
    countryInfo: PropTypes.object,
    today: PropTypes.object,
};
