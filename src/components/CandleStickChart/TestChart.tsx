import {ChartCanvas, Chart, XAxis, YAxis} from 'react-financial-charts';
import { TrendLine } from 'react-financial-charts';
import { discontinuousTimeScaleProvider } from 'react-financial-charts';
import {format} from "d3";

const generateRandomData = (length) => {
    const data = [];
    const startDate = new Date();

    for (let i = 0; i < length; i++) {
        const date = new Date(startDate.getTime() - i * 24 * 60 * 60 * 1000);
        const open = Math.random() * 1000 + 100;
        const high = open + Math.random() * 100;
        const low = open - Math.random() * 100;
        const close = open + Math.random() * 200 - 100;

        data.push({ date, open, high, low, close });
    }

    return data;
};

const MyChart = () => {
    const data = generateRandomData(100);

    const startDate = new Date(data[30].date);
    const endDate = new Date(data[80].date);

    const startCandle = data.find((d) => d.date.getTime() === startDate.getTime());
    const endCandle = data.find((d) => d.date.getTime() === endDate.getTime());

    const trendLine = {
        start: [startDate.getTime(), startCandle ? startCandle.high : 0],
        end: [endDate.getTime(), endCandle ? endCandle.high : 0],
    };

    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor((d) => d.date);
    const { data: xScaleData, xScale, xAccessor, displayXAccessor } = xScaleProvider(data);

    return (
        <ChartCanvas
            height={400}
            width={600}
            data={xScaleData}
            xScale={xScale}
            xAccessor={xAccessor}
            displayXAccessor={displayXAccessor}
            ratio={3}
            seriesName={'454'}
        >
            <Chart id={1} yExtents={(d) => [d.high, d.low]}>
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
                <TrendLine
                    enabled={true}
                    snap={false}
                    type={'RAY'}
                    snapTo={(d) => [d.high, d.low]}
                    trends={[
                        {
                            ...trendLine,
                            appearance: {
                                strokeStyle: '#fff',
                                strokeWidth: 2,
                            },
                            type: 'XLINE',
                        },
                    ]}
                />
            </Chart>
        </ChartCanvas>
    );
};

export default MyChart;
