import {FC, useEffect, useState} from 'react';
import {CandleStickData} from "../../Models/BinanceKlines.ts";

import {
    ChartCanvas,
    Chart,
    withSize,
    CrossHairCursor,
    StraightLine,
    MouseCoordinateY
} from "react-financial-charts";

import { CandlestickSeries } from "@react-financial-charts/series";
import { XAxis, YAxis } from "@react-financial-charts/axes";
import { discontinuousTimeScaleProvider } from "@react-financial-charts/scales";
import SolidityScreenerService from "../../Services/SolidityScreenerService.ts";

interface StockChartProps {
    width: number;
    height: number;
    symbol: string;
    interval: string;
    solidityInfo: number[];
}

const TestChart: FC<StockChartProps> = ({ symbol, interval, solidityInfo, width, height }) => {

    const [data, setKlines] = useState<CandleStickData[]>([]);
    const [klinesStreamSocket, setKlinesStreamSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        if (symbol !== "") SolidityScreenerService.StreamKlines(symbol, interval, 5000, setKlines, klinesStreamSocket, setKlinesStreamSocket);
    }, [symbol]);

    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
        (d: CandleStickData) => new Date(d.date)
    );
    const { data: xScaleData, xScale, xAccessor, displayXAccessor } =
        xScaleProvider(data);

    return (
        <ChartCanvas
            width={width}
            height={height}
            ratio={window.devicePixelRatio}
            seriesName="My Chart"
            data={xScaleData}
            xScale={xScale}
            xAccessor={xAccessor}
            displayXAccessor={displayXAccessor}
        >
            <Chart id={1} yExtents={(d: CandleStickData) => [d.high, d.low]}>
                <XAxis
                    axisAt="bottom"
                    orient="bottom"
                    strokeStyle={'#ccc'}
                    tickLabelFill={'#ccc'}

                    gridLinesStrokeStyle={'#ccc'}
                    gridLinesStrokeWidth={2}
                />
                <YAxis
                    axisAt="right"
                    orient="right"
                    ticks={5}
                    strokeStyle={'#ccc'}
                    tickLabelFill={'#ccc'}

                    gridLinesStrokeStyle={'#ccc'}
                    gridLinesStrokeWidth={2}
                />

                <MouseCoordinateY
                    at="right"
                    orient="right"
                    displayFormat={(value) => value.toFixed(2)}
                />

                <CandlestickSeries yAccessor={(d: CandleStickData) => d} />
                <CrossHairCursor strokeStyle={'#ccc'} />

                {solidityInfo.map((price, index) => (
                    <>
                        <StraightLine strokeStyle={'#ccc'} key={index} yValue={price} />
                    </>
                ))}
            </Chart>
        </ChartCanvas>
    );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const TestChartWithSize= withSize()(TestChart);

export default TestChartWithSize;
