import React, { useState, useEffect, useRef } from 'react';

import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts';

import { getLS, setLS } from './useLS';

const CurrencyGraph = ({ currency }) => {
    const [RateHistory, setRateHistory] = useState();
    const [Rates, setRates] = useState([]);
    const currencyRef = useRef(currency);
    const currencyKey = useRef(currency + 'key');
    const today = useRef(DateTime.now().toISODate());

    useEffect(() => {
        if (currencyRef.current !== currency) {
            currencyRef.current = currency;
            currencyKey.current = currency + 'key';
            setRates([]);
        }
    }, [currency]);

    useEffect(() => {
        const fetchRateHistory = async () => {
            console.log('fetch rates');
            try {
                const response = await fetch(
                    `https://api.exchangerate.host/timeseries?start_date=2021-03-01&end_date=${today.current}&base=SEK&symbols=${currency}`
                );
                const rateData = await response.json();
                setRateHistory(rateData);
            } catch (err) {
                console.log('Fetching error', err);
            }
        };
        try {
            getLS(currencyKey.current, setRates);
        } catch (err) {
            console.error(err);
            fetchRateHistory();
        }
    }, [currency]);

    useEffect(() => {
        if (RateHistory) {
            console.log('set rates');
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

    console.log('RateHistory', RateHistory);
    console.log('Rates', Rates);

    return (
        <>
            {currency && Rates.length !== 0 ? (
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
                            tickCount="4"
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
};

export default CurrencyGraph;
