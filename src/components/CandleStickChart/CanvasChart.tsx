import {
    BarSeries,
    CandlestickSeries,
    Chart, XAxis, YAxis,
    ChartCanvas, discontinuousTimeScaleProvider,
    CrossHairCursor, EdgeIndicator,
    MouseCoordinateY,TrendLine,
    withSize, PriceCoordinate, mouseBasedZoomAnchor,
} from "react-financial-charts";
import {FC, LegacyRef, useEffect, useRef} from "react";
import {CandleStickData} from "../../Models/BinanceKlines.ts";
import {format} from "d3";
import {SolidityModel} from "../../Models/SolidityModels.ts";
import {TrendInfo} from "../../Models/TrendLines.ts";

interface CanvasChartProps {
    data: CandleStickData[];
    solidityInfo?: SolidityModel;
    trendInfo?: TrendInfo;
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
        trendInfo,
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

    const startDate = new Date(trendInfo?.dates[0] || "");
    const startCandle: CandleStickData = xScaleData.find((d: CandleStickData) => d.date.getTime() === startDate.getTime());

    const endDate = new Date(trendInfo?.dates[2] || "");
    const endCandle: CandleStickData = xScaleData.find((d: CandleStickData) => d.date.getTime() === endDate.getTime());

    const trendLine = {
        start: [startDate.getTime(), !trendInfo?.type ? startCandle.high : startCandle.low],
        end: [endDate.getTime(), !trendInfo?.type ? endCandle.high : endCandle.low],
    }

    console.log(trendLine)


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
            zoomAnchor={mouseBasedZoomAnchor}
            ref={chartRef}
        >
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/*@ts-ignore*/}
            <Chart id={1} yExtents={(d: CandleStickData) => [d.high, d.low]}>
                <XAxis
                    ticks={3.2}
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
                    ticks={20}

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
                {
                    solidityInfo && solidityInfo.solidityLong?.price &&
                    <PriceCoordinate
                        price={solidityInfo.solidityLong?.price}
                        fill={'#fff'}
                        lineStroke={'#fff'}
                        orient={"left"}
                        textFill={'#000'}
                        stroke={'#000'}
                        rectWidth={solidityInfo.solidityLong?.price.toString().length * 8}
                        yAxisPad={20}
                        at={'left'}
                        dx={solidityInfo.solidityLong?.price.toString().length * 8}
                        arrowWidth={5}
                        rectHeight={13}
                        lineOpacity={50}
                    />
                }

                {
                    solidityInfo && solidityInfo.solidityShort?.price &&
                    <PriceCoordinate
                        price={solidityInfo.solidityShort?.price}
                        fill={'#fff'}
                        lineStroke={'#fff'}
                        orient={"left"}
                        textFill={'#000'}
                        stroke={'#000'}
                        rectWidth={solidityInfo.solidityShort?.price.toString().length * 8}
                        yAxisPad={20}
                        at={'left'}
                        dx={solidityInfo.solidityShort?.price.toString().length * 8}
                        arrowWidth={5}
                        rectHeight={13}
                        lineOpacity={50}
                    />
                }
                {
                    trendInfo &&
                    <TrendLine
                        enabled={false}
                        snap={false}
                        type={'LINE'}
                        snapTo={(d: CandleStickData) => [d.high, d.low]}
                        trends={[
                            {
                                start: [1688120100000, 0.0667],
                                end: [1688148000000, 0.0667],
                                appearance: {
                                    strokeStyle: "#fff"
                                },
                                type: 'RAY',
                            }
                        ]}
                    />
                }
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
