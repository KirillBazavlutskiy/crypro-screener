import {
    BarSeries,
    CandlestickSeries,
    Chart, XAxis, YAxis,
    ChartCanvas, discontinuousTimeScaleProvider,
    CrossHairCursor, EdgeIndicator,
    lastVisibleItemBasedZoomAnchor,
    MouseCoordinateY,
    withSize, PriceCoordinate,
} from "react-financial-charts";
import {FC, LegacyRef, useEffect, useRef} from "react";
import {CandleStickData} from "../../Models/BinanceKlines.ts";
import {format} from "d3";

interface CanvasChartProps {
    data: CandleStickData[];
    solidityInfo: number[];
    CandleColor: {
        up: string;
        down: string;
    }

    BarColor: {
        up: string;
        down: string;
    }
    width: number;
    height: number;
}

const CanvasChart: FC<CanvasChartProps> = (
    {
        data,
        solidityInfo,
        CandleColor,
        BarColor,
        width,
        height
    }) => {
    const xScaleProvider = discontinuousTimeScaleProvider
        .inputDateAccessor((d: CandleStickData) => new Date(d.date));
    const { data: xScaleData, xScale, xAccessor, displayXAccessor } = xScaleProvider(data);

    const chartRef: LegacyRef<ChartCanvas<number>> | undefined = useRef(null);

    const CalcCandleColor = (d: CandleStickData) => (d.close > d.open ? CandleColor.up : CandleColor.down);
    const CalcBarColor = (d: CandleStickData) => (d.close > d.open ? BarColor.up : BarColor.down);

    useEffect(() => {
        if (chartRef.current !== null) {
            chartRef.current.resetYDomain();
        }
    }, [solidityInfo])

    return (
        <ChartCanvas
            height={height}
            ratio={3}
            width={width}
            data={xScaleData}
            displayXAccessor={displayXAccessor}
            seriesName={`SolidityChart`}
            xScale={xScale}
            margin={{
                left: 0,
                right: 50,
                top: 0,
                bottom: 25
            }}
            xAccessor={xAccessor}
            zoomAnchor={lastVisibleItemBasedZoomAnchor}
            ref={chartRef}
        >
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/*@ts-ignore*/}
            <Chart id={1} yExtents={(d: CandleStickData) => [d.high, d.low]}>
                <XAxis
                    ticks={3.4}
                    strokeStyle={'#ccc'}
                    tickLabelFill={'#ccc'}
                    tickStrokeStyle={'#ccc'}
                    fontSize={12}

                    showGridLines
                    gridLinesStrokeStyle={'#303030'}
                />
                <YAxis
                    strokeStyle={'#ccc'}
                    tickLabelFill={'#ccc'}
                    tickStrokeStyle={'#ccc'}
                    tickFormat={format('.2f')}

                    showGridLines
                    gridLinesStrokeStyle={'#303030'}
                />

                <MouseCoordinateY
                    at="right"
                    orient="right"
                    displayFormat={(value) => value.toFixed(2)}
                    fill={'#383E55'}
                />

                <CandlestickSeries
                    fill={CalcCandleColor}
                    stroke={CalcCandleColor}
                    wickStroke={CalcCandleColor}
                    yAccessor={(d: CandleStickData) => d}
                />
                <CrossHairCursor strokeStyle={'#ccc'} />
                <EdgeIndicator
                    itemType={"last"}
                    yAccessor={(d: CandleStickData) => d.close}
                    fill={CalcCandleColor}
                    lineStroke={CalcCandleColor}
                />

                {solidityInfo.map((price, index) => (
                    <PriceCoordinate
                        key={index}
                        price={price}
                        fill={'#fff'}
                        lineStroke={'#fff'}
                        orient={"left"}
                        textFill={'#000'}
                        stroke={'#000'}
                        rectWidth={price.toString().length * 8}
                        yAxisPad={20}
                        at={'left'}
                        dx={price.toString().length * 8}
                        arrowWidth={5}
                        rectHeight={13}
                        lineOpacity={50}
                    />
                ))}
            </Chart>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/*@ts-ignore*/}
            <Chart
                id={2}
                origin={(w, h) => [w - w, h - 70]}
                height={70}
                yExtents={(d: CandleStickData) => d.volume}
            >
                <YAxis
                    axisAt="left"
                    orient="left"
                    ticks={5}
                    tickFormat={format(".2s")}
                />
                <BarSeries
                    yAccessor={(d: CandleStickData) => d.volume}
                    fillStyle={CalcBarColor}
                />
            </Chart>
        </ChartCanvas>
    );
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const CanvasChartWithSize= withSize()(CanvasChart);
export default CanvasChartWithSize;
