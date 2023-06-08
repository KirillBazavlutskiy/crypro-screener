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
    const symbols = await SolidityScreenerService.FindAllSolidity(10 ** 5, 0.5);

    console.log(symbols);

    return {
        props: { symbols },
        revalidate: 300,
    }
}
