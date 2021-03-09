import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import PropTypes from 'prop-types';

const CurrencyGraph = ({ currency }) => {
    const [RateHistory, setRateHistory] = useState();
    const [Rates, setRates] = useState([]);
    const currencyKey = currency + 'key';

    useEffect(() => {
        const fetchRateHistory = async () => {
            try {
                const response = await fetch(
                    'https://api.exchangerate.host/timeseries?start_date=2020-01-01&end_date=2020-04-01&base=SEK&symbols=' +
                        currency
                );
                const rateData = await response.json();
                setRateHistory(rateData);
            } catch (err) {
                console.log('Fetching error', err);
            }
        };
        setRates([]);
        fetchRateHistory();
    }, [currency]);

    useEffect(() => {
        console.log('Set');
        if (RateHistory) {
            console.log('Set Rates');
            for (const date in RateHistory.rates) {
                if (Object.hasOwnProperty.call(RateHistory.rates, date)) {
                    const dateNRate = {
                        date: date,
                        rate: RateHistory.rates[date][currency],
                    };
                    setRates((Rates) => [...Rates, dateNRate]);
                }
            }
        }
    }, [RateHistory, currency]);

    useEffect(() => {
        console.log('LS');
        if (RateHistory) {
            console.log('Rates.length', Rates.length);
            console.log(
                'RateHistory.rates.length',
                Object.keys(RateHistory.rates).length
            );
            if (
                (typeof window.localStorage.getItem(currencyKey) ===
                    'undefined' ||
                    window.localStorage.getItem(currencyKey) === null) &&
                Rates.length === Object.keys(RateHistory.rates).length
            ) {
                console.log('Set historical LS');
                console.log('Rates', Rates);
                window.localStorage.setItem(currencyKey, JSON.stringify(Rates));
            }
        }
    }, [Rates, currencyKey, RateHistory]);

    return (
        <>
            {currency && Rates.length !== 0 ? (
                <div>
                    <AreaChart width={400} height={145} data={Rates}>
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
                        <XAxis dataKey="date" />
                        <YAxis domain={['dataMin', 'dataMax']} />
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
                </div>
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
