import {useEffect, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import CandleStickChart from "../../components/CandleStickChart/CandleStickChart.tsx";
import {TrendInfo, TrendLineDate} from "../../Models/TrendLines.ts";
import TestChart from "../../components/CandleStickChart/TestChart.tsx";

const TrendLines = () => {

    const searchParams = useSearchParams()[0];

    const paramsJson = searchParams.get("json");

    const [ trendInfo, setTrendInfo ] = useState<TrendInfo>();

    useEffect(() => {
        if (paramsJson) {
            const splitedParams = paramsJson.replace(':', '!').split('!');
            const trendLineType
                = splitedParams[0] === 'UpTrendTouches';
            const jsonData: TrendLineDate[] = JSON.parse(`[${splitedParams[1].replaceAll(' ', '')}]`);
            const openDates = jsonData.map(d => d.OpenTime);
            setTrendInfo({
                type: trendLineType,
                dates: openDates,
            })
        }
    }, []);

    if (paramsJson) {
        return (
            <div className='w-full h-full'>
                <CandleStickChart symbol={'DOGEUSDT'} interval={'15m'} trendInfo={trendInfo}  />
            </div>
        );
    } else {
        return (
            <TestChart />
        )
    }
};

export default TrendLines;.
