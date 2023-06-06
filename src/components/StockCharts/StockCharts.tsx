'use client'

import React, {FC, useEffect, useState} from 'react';
import s from "./StockCharts.module.scss";
import CandleStickChart from "@/components/CandleStickChart/CandleStickChart";
import SolidityScreenerService from "@/Services/SolidityScreenerService";

interface StockChartsProps {
    activeSymbol: string;
}

const StockCharts: FC<StockChartsProps> = ({ activeSymbol }) => {

    const [solitidyPrices, setSolitidyPrices] = useState<number[]>([]);

    useEffect(() => {
        SolidityScreenerService.FindSolidity(activeSymbol, 0.5).then(solidity => {
            if (solidity !== null) {
                setSolitidyPrices([solidity.ask?.priceOnMaxVolume || 0, solidity.bid?.priceOnMaxVolume || 0]);
            }
        });
    }, [activeSymbol])

    return (
        <div className={s.chartsContainer}>
            <div className={s.chartContainer}>
                <CandleStickChart symbol={activeSymbol} interval={'5m'} solitydyInfo={solitidyPrices} />
            </div>
            <div className={s.chartContainer}>
                <CandleStickChart symbol={activeSymbol} interval={'30m'} solitydyInfo={solitidyPrices} />
            </div>
            <div className={s.chartContainer}>
                <CandleStickChart symbol={activeSymbol} interval={'2h'} solitydyInfo={solitidyPrices} />
            </div>
            <div className={s.chartContainer}>
                <CandleStickChart symbol={activeSymbol} interval={'4h'} solitydyInfo={solitidyPrices} />
            </div>
        </div>
    );
};

export default StockCharts;
