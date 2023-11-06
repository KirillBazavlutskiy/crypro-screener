import {useEffect, useState} from "react";
import SolidityScreenerService from "../../Services/SolidityScreenerService.ts";
import s from './index.module.scss';
import SquareLoader from "../../components/UI/SquareLoader/SquareLoader.tsx";
import StockCharts from "../../components/StockCharts/StockCharts.tsx";
import {SolidityModel} from "../../Models/SolidityModels.ts";

interface SymbolListType {
    loading: boolean;
    symbolList: SolidityModel[];
}

const Index = () => {
    const [symbols, setSymbols] = useState<SymbolListType>({
        loading: false,
        symbolList: []
    });
    const [activeSymbol, setActiveSymbol] = useState<string>("");

    const [options, setOptions] = useState({
        minVolume: `${50000}`,
        accessRatio: `${30}`
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

        setInterval(() => {
            fetchSymbols();
        }, 60000);
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
                <ul className={s.symbolsList}>
                    {
                        symbols.loading ? <SquareLoader /> :
                            symbols.symbolList.map(solidityModel =>
                                <li
                                    key={solidityModel.symbol}
                                    onClick={() => setActiveSymbol(solidityModel.symbol)}
                                    className={activeSymbol === solidityModel.symbol ? s.activeSymbol : ''}
                                >
                                    <p>{solidityModel.symbol}</p>
                                    <p>{solidityModel.solidity.ratio.toFixed(1)}</p>
                                </li>
                            )
                    }
                </ul>
            </div>

            <StockCharts activeSymbol={activeSymbol} />
        </div>
    )
}

export default Index
