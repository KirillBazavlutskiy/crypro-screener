import s from './App.module.css'
import TradingViewChart from "./components/TradingViewChart/TradingViewChart.tsx";
import {useEffect, useState} from "react";
import axios from "axios";

function App() {

    const [symbols, setSymbols] = useState<any[]>([]);

    const [activeSymbol, setActiveSymbol] = useState<string>("ETHBTC");

    useEffect(() => {
        axios
            .get<any>("https://api.binance.com/api/v3/exchangeInfo")
            .then((res) => setSymbols(res.data.symbols))
        axios
            .get<any>("https://api.binance.com/api/v3/depth/BTCUSDT").then(console.log)
    }, [])

    return (
        <div className={s.container}>
            <div className={s.navbar}>{
                symbols.map(symbol =>
                    <button
                        key={symbol.symbol}
                        onClick={() => setActiveSymbol(symbol.symbol)}
                        className={activeSymbol === symbol.symbol ? s.activeSymbol : ''}
                    >{symbol.symbol}</button>
                )
            }</div>
            <div className={s.grid}>
                <TradingViewChart symbol={activeSymbol} interval={'5m'} />
                <TradingViewChart symbol={activeSymbol} interval={'15m'} />
                <TradingViewChart symbol={activeSymbol} interval={'1h'} />
                <TradingViewChart symbol={activeSymbol} interval={'2h'} />
            </div>
        </div>
    )
}

export default App
