import {FC} from "react";
import {AdvancedRealTimeChart} from "react-ts-tradingview-widgets";
import s from './TradingViewChart.module.css';

interface TradingViewChartProps {
    symbol: string;
    interval: "1" | "3" | "5" | "15" | "30" | "60" | "120" | "180" | "240" | "D" | "W";
}

const TradingViewChart: FC<TradingViewChartProps> = ({ symbol, interval }) => (
    <div className={s.chartContainer}>
        <div className={s.chartContainerInner}>
            <AdvancedRealTimeChart
                symbol={symbol}
                interval={interval}
                hide_legend
                // hide_top_toolbar
                hide_side_toolbar
                allow_symbol_change={false}
                autosize
            ></AdvancedRealTimeChart>
        </div>
    </div>
)

export default TradingViewChart;
