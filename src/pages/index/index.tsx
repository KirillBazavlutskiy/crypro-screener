import {useEffect, useState} from "react";
import SolidityScreenerService from "../../Services/SolidityScreenerService.ts";
import s from './index.module.scss';
import SquareLoader from "../../components/UI/SquareLoader/SquareLoader.tsx";
import StockCharts from "../../components/StockCharts/StockCharts.tsx";

interface SymbolListType {
    loading: boolean;
    symbolList: string[];
}

const Index = () => {
    const [symbols, setSymbols] = useState<SymbolListType>({
        loading: false,
        symbolList: []
    });
    const [activeSymbol, setActiveSymbol] = useState<string>("");

    const [options, setOptions] = useState({
        minVolume: `${20 ** 6}`,
        accessRatio: `${0.5}`
    });

    const fetchSymbols = async () => {
        setSymbols({ ...symbols, loading: true })
        SolidityScreenerService.FindAllSolidity(parseInt(options.minVolume), parseInt(options.accessRatio)).then(res => setSymbols({
            loading: false,
            symbolList: res,
        }));
    }

    useEffect(() => {
        fetchSymbols();
    }, []);

    return (
        <div className={s.container}>
            <div className={s.navbar}>
                <div className={s.options}>
                    <div className={s.labels}>
                        <label>
                            <p>Min Volume</p>
                            <input
                                value={options.minVolume}
                                onChange={e => {
                                    setOptions({ ...options, minVolume: e.target.value })
                                }}
                                type="text"
                            />
                        </label>
                        <label>
                            <p>Access Ratio</p>
                            <input
                                value={options.accessRatio}
                                onChange={e => {
                                    setOptions({ ...options, accessRatio: e.target.value })
                                }}
                                type="text"
                            />
                        </label>
                    </div>
                    <button onClick={() => fetchSymbols()}>Search</button>
                </div>
                <div className={s.symbolsList}>
                    {
                        symbols.loading ? <SquareLoader /> :
                            symbols.symbolList.map(symbol =>
                                <button
                                    key={symbol}
                                    onClick={() => setActiveSymbol(symbol)}
                                    className={activeSymbol === symbol ? s.activeSymbol : ''}
                                >{symbol}</button>
                            )
                    }
                </div>
            </div>

            <StockCharts activeSymbol={activeSymbol} />
        </div>
    )
}

export default Index
