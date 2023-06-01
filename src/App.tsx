import './App.css'
import TradingViewChart from "./components/TradingViewChart/TradingViewChart.tsx";
import {useEffect, useState} from "react";
import axios from "axios";

function App() {

    const [symbols, setSymbols] = useState<any[]>([]);

    const [activeSymbol, setActiveSymbol] = useState<string>("BTCUSDT");

    useEffect(() => {
        axios.get<any>("https://api.binance.com/api/v3/exchangeInfo").then((res) => {
            console.log(res.data.symbols);
            setSymbols(res.data.symbols);
        })
    }, [])

    return (
        <div className={'container'}>
            <div className='navbar'>{
                symbols.map(s => <button onClick={() => setActiveSymbol(s.symbol)}>{s.symbol}</button>)
            }</div>
            <div className="grid">
                <TradingViewChart symbol={activeSymbol} interval={'5'}/>
                <TradingViewChart symbol={activeSymbol} interval={'60'}/>
                <TradingViewChart symbol={activeSymbol} interval={'180'}/>
                <TradingViewChart symbol={activeSymbol} interval={'240'}/>
            </div>
        </div>
    )
}

export default App
