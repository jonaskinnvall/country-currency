import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import InputField from './InputField';
import CurrencyGraph from './CurrencyGraph';

import './styles.css';

const getRate = (currency, amount) => {
    const rate = currency / amount;
    return rate.toFixed(3);
};

const fetchRate = async (query, targetCurr) => {
    const cache = localStorage.getItem(targetCurr);
    if (cache && query === '1') {
        return JSON.parse(cache);
    }

    const response = await fetch(
        'https://api.exchangerate.host/convert?from=SEK&to=' +
            targetCurr +
            '&amount=' +
            query
    );
    if (response.ok) {
        const data = await response.json();
        localStorage.setItem(
            targetCurr,
            JSON.stringify(getRate(data.result, query))
        );
        return data.result.toFixed(3);
    }

    throw Error(`Request rejected with status ${response.status}`);
};

const CountryCard = ({ countryInfo, today }) => {
    const initialDate = today.minus({ week: 1 }).toISODate();
    const endDate = today.toISODate();

    const [amountSEK, setAmountSEK] = useState('1');
    const [currency, setCurrency] = useState();
    const [error, setError] = useState();
    const [startDate, setStart] = useState({
        date: initialDate,
        type: '1week',
    });

    // UseEffect to fetch exchange rate when user has
    // searched for a country and types a value in SEK field
    useEffect(() => {
        if (amountSEK) {
            setError(null);
            fetchRate(amountSEK, countryInfo.currencies[0].code).then(
                (currency) => setCurrency(currency),
                (error) => setError(error.message)
            );
        }
        return () => {
            setAmountSEK('1');
        };
    }, [amountSEK, countryInfo]);

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
                            <p> Could not fetch currency rate</p>
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
                    endDate={endDate}
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
