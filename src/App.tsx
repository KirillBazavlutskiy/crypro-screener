import s from './App.module.scss'
import CandleStickChart from "./components/CandleStickChart/CandleStickChart.tsx";
import {useEffect, useState} from "react";
import SolidityScreenerService from "./Services/SolidityScreenerService.ts";
import useSWR from "swr";

function App() {
    const { data, isLoading, error } = useSWR<string[]>('symbols', SolidityScreenerService.FindAllSolidity);

    const [activeSymbol, setActiveSymbol] = useState<string>("");

    const [solitidyPrices, setSolitidyPrices] = useState<number[]>([]);

    useEffect(() => {
        SolidityScreenerService.FindSolidity(activeSymbol, 0.5).then(solidity => {
            if (solidity !== null) {
                setSolitidyPrices([solidity.ask?.priceOnMaxVolume || 0, solidity.bid?.priceOnMaxVolume || 0]);
            }
        });
    }, [activeSymbol])

    return (
        <div className={s.container}>
            <div className={s.navbar}>
                {isLoading && <div className={s.loadingSpin}></div>}
                {
                    data && data.map(symbol =>
                        <button
                            key={symbol}
                            onClick={() => setActiveSymbol(symbol)}
                            className={activeSymbol === symbol ? s.activeSymbol : ''}
                        >{symbol}</button>
                    )
                }
                {error && <h1 className='text-red-700'>Error</h1>}
            </div>

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
