import { BinanceDataKline, CandleStickData } from '../Models/BinanceKlines';
import { OrderBook } from '../Models/BinanceDepth';
import { TradingPair } from '../Models/BinanceTicket';
import { Dispatch, SetStateAction } from 'react';
import {BinanceAPI} from "../http";
import {SolidityModel, SolidityTicket} from "../Models/SolidityModels.ts";
import axios from "axios";

export default class SolidityScreenerService {
	static FetchAllSymbols = async (minVolume: number): Promise<string[]> => {
		const { data } = await BinanceAPI.get<TradingPair[]>('/ticker/24hr');
		const { data: futuresExchangeInfo } = await axios.get('https://fapi.binance.com/fapi/v1/exchangeInfo');
		const futuresSymbols = futuresExchangeInfo.symbols.map((symbolInfo: any) => symbolInfo.symbol);

		return data
			.filter(tradingPair => !(tradingPair.symbol.includes('BTC') || tradingPair.symbol.includes('ETH') || tradingPair.symbol.includes('USDC')))
			.filter(tradingPair => futuresSymbols.includes(tradingPair.symbol))
			.filter(tradingPair => {
				return tradingPair.symbol.substring(tradingPair.symbol.length - 4, tradingPair.symbol.length) === "USDT"
			})
			.filter(tradingPair => parseFloat(tradingPair.quoteVolume) > minVolume)
			.map(tradingPair => tradingPair.symbol);
	};

	static StreamKlines = async (
		symbol: string,
		interval: string,
		limit: number,
		setKlines: Dispatch<SetStateAction<CandleStickData[]>>,
		klinesStreamSocket: WebSocket | null,
		setKlinesStreamSocket: Dispatch<SetStateAction<WebSocket | null>>
	): Promise<void> => {
		try {
			if (klinesStreamSocket !== null) {
				klinesStreamSocket.close();
				setKlinesStreamSocket(null);
			}

			const { data } = await BinanceAPI.get<BinanceDataKline[]>(
				`/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
			);
			setKlines(
				data.map(candlestick => ({
					date: new Date(candlestick[0]),
					open: Number(candlestick[1]),
					high: Number(candlestick[2]),
					low: Number(candlestick[3]),
					close: Number(candlestick[4]),
					volume: Number(candlestick[5]),
				}))
			);

			const newKlinesStreamSocket: WebSocket = new WebSocket(
				`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`
			);

			newKlinesStreamSocket.onmessage = event => {
				const klineData = JSON.parse(event.data);

				if (klineData.e === 'kline') {
					const candlestick = klineData.k;

					const newKline: CandleStickData = {
						date: new Date(klineData.k.t),
						open: Number(candlestick.o),
						high: Number(candlestick.h),
						low: Number(candlestick.l),
						close: Number(candlestick.c),
						volume: Number(candlestick.v),
					};

					setKlines(prevData => {
						const lastKline = prevData[prevData.length - 1];
						if (lastKline.date.getTime() === newKline.date.getTime()) {
							return [...prevData.slice(0, -1), newKline];
						} else {
							return [...prevData, newKline];
						}
					});
				}
			};

			setKlinesStreamSocket(newKlinesStreamSocket);
		} catch (e) {
			console.log(e);
		}
	};

	static FetchOrderBook = async (symbol: string): Promise<OrderBook> => {
		const { data } = await BinanceAPI.get<OrderBook>(
			`/depth?symbol=${symbol}`
		);
		return data;
	};

	static FindSolidity = async (
		symbol: string,
	): Promise<SolidityModel> => {
		const orderBook = await this.FetchOrderBook(symbol);

		const bindNAsks = [ ...orderBook.asks, ...orderBook.bids ];


		let sumOrders = 0;
		let maxOrder = 0;
		let maxOrderPrice = 0;

		bindNAsks.forEach(bid => {
			const volume = parseFloat(bid[1]);
			sumOrders += volume;
			if (maxOrder < volume) {
				maxOrder = volume;
				maxOrderPrice = parseFloat(bid[0]);
			}
		});

		const solidityRatio = maxOrder / (sumOrders / 100);

		const solidity: SolidityTicket = {
			price: maxOrderPrice,
			ratio: solidityRatio,
			volume: maxOrder,
		}

		return {
			symbol: symbol,
			solidity: solidity
		}
	};

	static FindAllSolidity = async (minVolume: number, ratioAccess: number) => {
		const symbols = await this.FetchAllSymbols(minVolume);
		const symbolsWithSolidity: SolidityModel[] = [];

		const symbolsGroupLength = 30;

		for (let i = 0; i < symbols.length; i += symbolsGroupLength) {
			const symbolsGroup =
				symbols.length - i > symbolsGroupLength ? symbols.slice(i, i + symbolsGroupLength) : symbols.slice(i, symbols.length);

			await Promise.all(
				symbolsGroup.map(async (symbol) => {
					const solidityModel = await this.FindSolidity(symbol);
					if (solidityModel.solidity.ratio > ratioAccess) {
						symbolsWithSolidity.push(solidityModel);
					}
				})
			);
		}
		return symbolsWithSolidity;
	};
}
