import s from './App.module.css'
import TradingViewChart from "./components/TradingViewChart/TradingViewChart.tsx";
import {useEffect, useState} from "react";
import axios from "axios";

function App() {

    const [symbols, setSymbols] = useState<any[]>([]);

    const [activeSymbol, setActiveSymbol] = useState<string>("BTCUSDT");

    useEffect(() => {
        axios
            .get<any>("https://api.binance.com/api/v3/exchangeInfo")
            .then((res) => setSymbols(res.data.symbols))
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
                <TradingViewChart symbol={activeSymbol} interval={'5'}/>
                <TradingViewChart symbol={activeSymbol} interval={'60'}/>
                <TradingViewChart symbol={activeSymbol} interval={'180'}/>
                <TradingViewChart symbol={activeSymbol} interval={'240'}/>
            </div>
        </div>
    )
}

export default App
