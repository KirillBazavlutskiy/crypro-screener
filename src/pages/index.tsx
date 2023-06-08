import SolidityScreenerService from "@/Services/SolidityScreenerService";
import s from './index.module.scss';
import StockCharts from "@/components/StockCharts/StockCharts";
import {useState} from "react";
import {GetStaticProps} from "next";

interface IndexPageProps {
    symbols: string[];
    error: any | null;
}

export default function Index({ symbols, error }: IndexPageProps) {

    const [activeSymbol, setActiveSymbol] = useState<string>("");

    console.log(symbols);
    console.log(error);

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
    try {
        const symbols = await SolidityScreenerService.FindAllSolidity();
        return {
            props: { symbols, error: null },
            revalidate: 300,
        }
    } catch (e) {
        return {
            props: {
                symbols: [ 'error' ],
                error: e
            },
            revalidate: 300,
        }
    }
}
