import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {CreateCandleStickChart} from "../../CandleStickChartService.ts";

interface StockChartProps {
    symbol: string;
    interval: string;
}

export interface CandleStickData {
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

type DataStick = [
    Date,
    string,
    string,
    string,
    string,
    string,
    number,
    string,
    number,
    string,
    string,
    string
];

const StockChart: React.FC<StockChartProps> = ({ symbol, interval}) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [klines, setKlines] = useState<CandleStickData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                axios
                    .get<DataStick[]>(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=400`)
                    .then(({ data }) => {
                        setKlines(data.map(candlestick => ({
                            date: new Date(candlestick[0]),
                            open: Number(candlestick[1]),
                            high: Number(candlestick[2]),
                            low: Number(candlestick[3]),
                            close: Number(candlestick[4]),
                            volume: Number(candlestick[5])
                        })));
                    });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [symbol]);

    useEffect(() => {
        CreateCandleStickChart(svgRef, klines);
    }, [klines]);

    return (
        <svg ref={svgRef} width={"100%"} height={"100%"} onResize={() => CreateCandleStickChart(svgRef, klines)}>
            <g className="x-axis" transform="translate(0, 920)" />
            <g className="y-axis" transform="translate(50, 30)" />
            <g className="candlestick-group" transform="translate(50, 30)" />
            <g className="line-high-group" transform="translate(50, 30)" />
            <g className="line-low-group" transform="translate(50, 30)" />
        </svg>
    );
};

export default StockChart;
