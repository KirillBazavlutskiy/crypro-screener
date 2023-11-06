import { FC, useEffect, useState } from 'react';
import SolidityScreenerService from '../../Services/SolidityScreenerService';
import CandleStickChart from "../CandleStickChart/CandleStickChart.tsx";
import s from './StockCharts.module.scss';
import {SolidityModel} from "../../Models/SolidityModels.ts";

interface StockChartsProps {
	activeSymbol: string;
}

const StockCharts: FC<StockChartsProps> = ({ activeSymbol }) => {
	const [solitidyPrices, setSolitidyPrices] = useState<SolidityModel>();

	const fetchSolidity = async () => {
		const solidity= await SolidityScreenerService.FindSolidity(activeSymbol);
		setSolitidyPrices(solidity);
	}

	useEffect(() => {
		if (activeSymbol !== '') {
			fetchSolidity();
		}
	}, [activeSymbol]);

	if (solitidyPrices !== undefined) {
		return (
			<div className={s.chartsContainer}>
				<div className={s.chartContainer}>
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
	} else {
		return <></>
	}
};

export default StockCharts;
