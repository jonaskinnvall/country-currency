import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts';

const fixRates = (fetchedRates, currency) => {
    let rates = [];
    for (const date in fetchedRates) {
        if (Object.hasOwnProperty.call(fetchedRates, date)) {
            const dateNRate = {
                date: date.replace(/^20/, ''),
                rate: fetchedRates[date][currency],
            };
            rates.push(dateNRate);
        }
    }
    return rates;
};

const fetchRates = async (currency, startDate, endDate, key) => {
    const cache = localStorage.getItem(key);
    if (cache) {
        return JSON.parse(cache);
    }

    const response = await fetch(
        `https://api.exchangerate.host/timeseries?start_date=${startDate.date}&end_date=${endDate}&base=SEK&symbols=${currency}`
    );
    if (response.ok) {
        const rateData = await response.json();
        const fixedRates = fixRates(rateData.rates, currency);
        localStorage.setItem(key, JSON.stringify(fixedRates));
        return fixedRates;
    }

    throw Error(`Request rejected with status ${response.status}`);
};

const CurrencyGraph = ({ currency, startDate, endDate }) => {
    const [rates, setRates] = useState([]);
    const [error, setError] = useState();

    useEffect(() => {
        setError(null);
        setRates([]);
        const currencyKey = currency + startDate.type;
        fetchRates(currency, startDate, endDate, currencyKey).then(
            (rates) => setRates(rates),
            (error) => setError(error)
        );
    }, [currency, startDate, endDate]);

    return (
        <>
            {error ? (
                <p>{error} Could note fetch graph data. </p>
            ) : currency && rates.length !== 0 ? (
                <ResponsiveContainer width="80%" height={145}>
                    <AreaChart
                        data={rates}
                        margin={{ top: 10, right: 42, left: 0, bottom: 17 }}
                    >
                        <defs>
                            <linearGradient
                                id="colorRate"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="75%"
                                    stopColor="#f4f0e4"
                                    stopOpacity={1}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#f4f0e4"
                                    stopOpacity={0.8}
                                />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            angle="15"
                            tickMargin={15}
                            interval={'preserveStart'}
                        />
                        <YAxis
                            type="number"
                            scale="linear"
                            domain={[
                                (dataMin) => dataMin - dataMin * 0.005,
                                (dataMax) => dataMax + dataMax * 0.005,
                            ]}
                            interval={0}
                            tickCount="3"
                            tickMargin={5}
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(9, 158, 128, 0.8)',
                                borderColor: '"#f4f0e4"',
                                borderRadius: '5px',
                            }}
                            itemStyle={{ color: '#f4f0e4' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="rate"
                            stroke="#f4f0e4"
                            fillOpacity={1}
                            fill="url(#colorRate)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
                <div></div>
            )}
        </>
    );
};

CurrencyGraph.propTypes = {
    currency: PropTypes.string.isRequired,
    startDate: PropTypes.object,
    endDate: PropTypes.string,
};

export default CurrencyGraph;
