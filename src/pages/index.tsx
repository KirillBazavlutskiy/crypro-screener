import SolidityScreenerService from "@/Services/SolidityScreenerService";
import s from './index.module.scss';
import StockCharts from "@/components/StockCharts/StockCharts";
import {useState} from "react";
import {GetStaticProps} from "next";

interface IndexPageProps {
    symbols: string[];
}

export default function Index({ symbols }: IndexPageProps) {

    const [activeSymbol, setActiveSymbol] = useState<string>("");
    console.log(symbols);

    return (
        <div className={s.container}>
            <div className={s.navbar}>
                {
                    symbols.map(symbol =>
                        <button
                            key={symbol}
                            onClick={() => setActiveSymbol(symbol)}
                            className={activeSymbol === symbol ? s.activeSymbol : ''}
                        >{symbol}</button>
                    )
                }
            </div>

            <StockCharts activeSymbol={activeSymbol} />
        </div>
    )
}

export const getStaticProps: GetStaticProps<IndexPageProps> = async () => {

    console.log(process.env.BINANCE_DOMEN);

    const symbols = await SolidityScreenerService.FindAllSolidity();
    return {
        props: { symbols },
        revalidate: 300,
    }
}
