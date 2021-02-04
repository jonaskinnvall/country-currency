import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CurrencyGraph = ({ currency }) => {
    const [RateHistory, setRateHistory] = useState();
    let rates = [];

    useEffect(() => {
        const fetchRateHistory = async () => {
            try {
                const response = await fetch(
                    'https://api.exchangerate.host/timeseries?start_date=2020-01-01&end_date=2020-01-04&base=SEK&symbols=' +
                        currency
                );
                const rateData = await response.json();
                setRateHistory(rateData);
            } catch (err) {
                console.log('Fetching error', err);
            }
        };
        fetchRateHistory();
    }, [currency]);

    useEffect(() => {
        console.log('RateHistory', RateHistory);
        if (RateHistory) {
            for (const rate in RateHistory.rates) {
                if (Object.hasOwnProperty.call(RateHistory.rates, rate)) {
                    const dateNRate = {
                        date: rate,
                        rate: RateHistory.rates[rate][currency],
                    };
                    rates.push(dateNRate);
                }
            }
        }
        console.log('rates', rates);
    }, [RateHistory]);

    return <>{currency ? <div>{currency}</div> : <div></div>}</>;
};

CurrencyGraph.propTypes = {
    currency: PropTypes.string.isRequired,
};

export default CurrencyGraph;
