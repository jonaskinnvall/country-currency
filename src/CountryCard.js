import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import InputField from './InputField';
import './styles.css';

const CountryCard = ({ countryInfo }) => {
    const [AmountSEK, setAmountSEK] = useState();
    const [Currency, setCurrency] = useState();

    // UseEffect to fetch exchange rate when user has
    // searched for a country and types a value in SEK field
    useEffect(() => {
        const fetchRate = (amount, targetCurr) => {
            fetch(
                'https://api.exchangerate.host/convert?from=SEK&to=' +
                    targetCurr +
                    '&amount=' +
                    amount
            )
                .then((response) => response.json())
                .then((data) => setCurrency(data))
                .catch((err) => console.log('Fetching error', err));
        };

        if (AmountSEK && countryInfo) {
            fetchRate(AmountSEK, countryInfo.currencies[0].code);
        }
    }, [AmountSEK, countryInfo]);

    return (
        <>
            {!countryInfo ? (
                <div>
                    <h2>
                        Fetching error... No country with matching name or
                        country code. Please try again.
                    </h2>
                </div>
            ) : (
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
                            Population:{' '}
                            {countryInfo.population.toLocaleString()}
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
            )}
        </>
    );
};

export default CountryCard;

CountryCard.propTypes = {
    countryInfo: PropTypes.object,
};
