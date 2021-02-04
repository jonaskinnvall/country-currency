import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import PropTypes from 'prop-types';

const CurrencyGraph = ({ currency }) => {
    const [RateHistory, setRateHistory] = useState();
    const [Rates, setRates] = useState([]);

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
        if (RateHistory) {
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
    }, [RateHistory]);

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
                                    offset="5%"
                                    stopColor="#faa5aa"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#faa5aa"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" />
                        <YAxis domain={['dataMin', 'dataMax']} />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="rate"
                            stroke="#091668"
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
