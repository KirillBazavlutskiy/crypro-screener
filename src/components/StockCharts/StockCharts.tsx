import { FC, useEffect, useState } from 'react';
import SolidityScreenerService from '../../Services/SolidityScreenerService';
import CandleStickChart from "../CandleStickChart/CandleStickChart.tsx";
import s from './StockCharts.module.scss';
import * as cn from "classnames";

interface StockChartsProps {
	activeSymbol: string;
}

const StockCharts: FC<StockChartsProps> = ({ activeSymbol }) => {
	const [solitidyPrices, setSolitidyPrices] = useState<number[]>([]);

	useEffect(() => {
		if (activeSymbol !== '') {
			SolidityScreenerService.FindSolidity(activeSymbol, 0.5).then(solidity => {
				if (solidity !== null) {
					setSolitidyPrices([
						solidity.ask?.priceOnMaxVolume || 0,
						solidity.bid?.priceOnMaxVolume || 0,
					]);
				}
			});
		}
	}, [activeSymbol]);

	return (
		<div className={s.chartsContainer}>
			<div className={cn(s.chartContainer, s.firstChat)}>
				<CandleStickChart
					symbol={activeSymbol}
					interval={'5m'}
					solidityInfo={solitidyPrices}
				/>
			</div>
			<div className={s.chartContainer}>
				<CandleStickChart
					symbol={activeSymbol}
					interval={'30m'}
					solidityInfo={solitidyPrices}
				/>
			</div>
			<div className={s.chartContainer}>
				<CandleStickChart
					symbol={activeSymbol}
					interval={'2h'}
					solidityInfo={solitidyPrices}
				/>
			</div>
			<div className={s.chartContainer}>
				<CandleStickChart
					symbol={activeSymbol}
					interval={'4h'}
					solidityInfo={solitidyPrices}
				/>
			</div>
		</div>
	);
};

export default StockCharts;
