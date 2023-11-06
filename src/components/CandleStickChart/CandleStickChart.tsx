import {FC, useEffect, useState} from 'react';
import {CandleStickData} from "../../Models/BinanceKlines.ts";

import SolidityScreenerService from "../../Services/SolidityScreenerService.ts";

import CanvasChart from "./CanvasChart.tsx";
import {SolidityModel} from "../../Models/SolidityModels.ts";
import SquareLoader from "../UI/SquareLoader/SquareLoader.tsx";

interface StockChartProps {
    symbol: string;
    interval: string;
    solidityInfo?: SolidityModel;
}

const CandleStickChart: FC<StockChartProps> = ({ symbol, interval, solidityInfo}) => {

    const [data, setKlines] = useState<CandleStickData[]>([]);
    const [klinesStreamSocket, setKlinesStreamSocket] = useState<WebSocket | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        if (klinesStreamSocket !== null) {
            klinesStreamSocket.close();
            setKlinesStreamSocket(null)
        }
        if (symbol !== "") {
            SolidityScreenerService
                .StreamKlines(
                    symbol,
                    interval,
                    5000,
                    setKlines,
                    klinesStreamSocket,
                    setKlinesStreamSocket
                )
                .then(() => setLoading(false));
        }
    }, [symbol]);

    if (loading) {
        return <SquareLoader />
    } else {
        return (
            <CanvasChart
                data={data}
                solidityInfo={solidityInfo}
                CandleColor={{
                    up: 'rgba(76, 199, 145, 1)',
                    down: 'rgba(199, 86, 76, 1)'
                }}
                BarColor={{
                    up: 'rgba(76, 199, 145, 0.4)',
                    down: 'rgba(199, 86, 76, 0.4)'
                }}
            />
        );
    }
}

export default CandleStickChart;
