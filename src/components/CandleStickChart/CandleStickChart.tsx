import React, {useEffect, useRef, useState} from "react";
import SolidityScreenerService from "../../Services/SolidityScreenerService.ts";
import {CandleStickData} from "../../Models/BinanceKlines.ts";
import CandleStickChartService from "../../Services/CandleStickChartService.ts";
import s from './CandleStickChart.module.css';

interface StockChartProps {
    symbol: string;
    interval: string;
    solitydyInfo: number[];
}

const CandleStickChart: React.FC<StockChartProps> = ({ symbol, interval, solitydyInfo }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [klines, setKlines] = useState<CandleStickData[]>([]);
    const [klinesStreamSocket, setKlinesStreamSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        if (symbol !== "") SolidityScreenerService.StreamKlines(symbol, interval, 100, setKlines, klinesStreamSocket, setKlinesStreamSocket);
    }, [symbol]);

    useEffect(() => {
        if (symbol !== "") CandleStickChartService.CreateCandleStickChart(svgRef, klines, solitydyInfo);
    }, [klines]);

    return (
        <svg className={s.chart} ref={svgRef} width={"100%"} height={"100%"}>
            <g className="x-axis" />
            <g className="y-axis" transform="translate(50, 30)" />
            <g className="candlestick-group" transform="translate(0, 30)" />
            <g className="line-high-group" transform="translate(0, 30)" />
            <g className="line-low-group" transform="translate(0, 30)" />
            <g className="solidity-lines-group" transform="translate(0, 30)" />
        </svg>
    );
};

export default CandleStickChart;
