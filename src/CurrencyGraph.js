import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts';

import { getLS, setLS } from './useLS';

const CurrencyGraph = ({ currency, startDate, endDate }) => {
    const [RateHistory, setRateHistory] = useState();
    const [Rates, setRates] = useState([]);
    const [error, setError] = useState();
    const currencyRef = useRef(currency);
    const currencyKey = useRef(currency + startDate.type);

    useEffect(() => {
        if (currencyRef.current !== currency) {
            currencyRef.current = currency;
            currencyKey.current = currency + startDate.type;
            setError();
            setRates([]);
        }
        if (currencyKey.current !== startDate.type) {
            currencyKey.current = currency + startDate.type;
            setRates([]);
        }
    }, [currency, startDate]);

    useEffect(() => {
        const fetchRateHistory = async () => {
            try {
                const response = await fetch(
                    `https://api.exchangerate.host/timeseries?start_date=${startDate.date}&end_date=${endDate}&base=SEK&symbols=${currency}`
                );
                if (response.ok) {
                    const rateData = await response.json();
                    setRateHistory(rateData);
                } else {
                    setRateHistory();
                    throw Error(
                        `Request rejected with status ${response.status}`
                    );
                }
            } catch (err) {
                setError(err.message);
            }
        };
        try {
            getLS(currencyKey.current, setRates);
        } catch (err) {
            fetchRateHistory();
        }
    }, [currency, startDate, endDate]);

    useEffect(() => {
        if (RateHistory) {
            for (const date in RateHistory.rates) {
                if (Object.hasOwnProperty.call(RateHistory.rates, date)) {
                    const dateNRate = {
                        date: date,
                        rate: RateHistory.rates[date][currencyRef.current],
                    };
                    setRates((Rates) => [...Rates, dateNRate]);
                }
            }
        }
    }, [RateHistory]);

    useEffect(() => {
        if (
            RateHistory &&
            Rates.length === Object.keys(RateHistory.rates).length
        ) {
            setLS(currencyKey.current, Rates);
        }
    }, [Rates, RateHistory]);

    return (
        <>
            {error ? (
                <p>{error} Could note fetch graph data. </p>
            ) : currency && Rates.length !== 0 ? (
                <ResponsiveContainer width="80%" height={145}>
                    <AreaChart
                        data={Rates}
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
                <div className="graph-placeholder"></div>
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
