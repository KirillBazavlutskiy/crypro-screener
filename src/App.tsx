import s from './App.module.scss'
import CandleStickChart from "./components/CandleStickChart/CandleStickChart.tsx";
import {useEffect, useState} from "react";
import SolidityScreenerService from "./Services/SolidityScreenerService.ts";

function App() {

    const [symbols, setSymbols] = useState<string[]>([]);

    const [activeSymbol, setActiveSymbol] = useState<string>("");

    const [solitidyPrices, setSolitidyPrices] = useState<number[]>([]);

    useEffect(() => {
        SolidityScreenerService.FindAllSolidity().then(setSymbols);
    }, [])

    useEffect(() => {
        SolidityScreenerService.FindSolidity(activeSymbol, 0.5).then(solidity => {
            if (solidity !== null) {
                setSolitidyPrices([solidity.ask?.priceOnMaxVolume || 0, solidity.bid?.priceOnMaxVolume || 0]);
            }
        });
    }, [activeSymbol])

    return (
        <div className={s.container}>
            <div className={s.navbar}>{
                symbols.map(symbol =>
                    <button
                        key={symbol}
                        onClick={() => setActiveSymbol(symbol)}
                        className={activeSymbol === symbol ? s.activeSymbol : ''}
                    >{symbol}</button>
                )
            }</div>
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
        </div>
    )
}

export default App
