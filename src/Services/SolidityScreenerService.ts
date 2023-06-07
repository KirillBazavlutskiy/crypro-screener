import axios from "axios";
import {BinanceDataKline, CandleStickData} from "@/Models/BinanceKlines";
import {FindSolidityFuncReturn, OrderBook} from "@/Models/BinanceDepth";
import {TradingPair} from "@/Models/BinanceTicket";
import {Dispatch, SetStateAction} from "react";

export default class SolidityScreenerService {
    static FetchAllSymbols = async (minVolume: number): Promise<string[]> => {
        try {
            const { data } = await axios.get<TradingPair[]>('https://api.binance.com/api/v3/ticker/24hr');

            return data
                .filter(tradingPair => parseFloat(tradingPair.quoteVolume) > minVolume)
                .map(tradingPair => tradingPair.symbol);
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    static StreamKlines =
        async (
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
                console.log("deleted")
            }

            const { data } = await axios.get<BinanceDataKline[]>(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`);
            setKlines(data.map(candlestick => ({
                date: new Date(candlestick[0]),
                open: Number(candlestick[1]),
                high: Number(candlestick[2]),
                low: Number(candlestick[3]),
                close: Number(candlestick[4]),
                volume: Number(candlestick[5])
            })));

            const newKlinesStreamSocket: WebSocket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`);

            newKlinesStreamSocket.onmessage = (event) => {
                console.log(`stream from ${symbol}`)
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

                    setKlines((prevData) => {
                        const lastKline = prevData[prevData.length - 1];
                        if (lastKline.date.getTime() === newKline.date.getTime()) {
                            return [ ...prevData.slice(0, -1), newKline ];
                        } else {
                            return [ ...prevData, newKline ]
                        }
                    });
                }
            };

            setKlinesStreamSocket(newKlinesStreamSocket);
        } catch (e) {
            console.log(e);
        }
    }

    static FetchOrderBook = async (symbol: string): Promise<OrderBook> => {
        const { data } = await axios.get<OrderBook>(`https://api.binance.com/api/v3/depth?symbol=${symbol}`);
        return data;
    }

    static FindSolidity = async (symbol: string, ratioAccess: number): Promise<FindSolidityFuncReturn | null>  => {
        let solidityInfo: FindSolidityFuncReturn = {}
        const orderBook = await this.FetchOrderBook(symbol);

        let sumAsks: number = 0;
        let maxAsk: number = 0;
        let maxAskPrice = 0;
        orderBook.asks.forEach((ask) => {
            const volume = parseFloat(ask[1])
            sumAsks += volume;
            if (maxAsk < volume) {
                maxAsk = volume;
                maxAskPrice = parseFloat(ask[0])
            }
        })

        let sumBids: number = 0;
        let maxBid: number = 0;
        let maxBidPrice = 0;
        orderBook.bids.forEach((bid) => {
            const volume = parseFloat(bid[1])
            sumBids += volume;
            if (maxBid < volume) {
                maxBid = volume;
                maxBidPrice = parseFloat(bid[0])
            }
        })

        const solidityOnAsks = maxAsk / (sumAsks / 100) > ratioAccess;
        const solidityOnBids = maxBid / (sumBids / 100) > ratioAccess;

        if (solidityOnAsks || solidityOnBids) {
            if (solidityOnAsks) {
                solidityInfo.ask = {
                    maxVolume: maxAsk,
                    priceOnMaxVolume: maxAskPrice,
                }
            }
            if (solidityOnBids) {
                solidityInfo.bid = {
                    maxVolume: maxBid,
                    priceOnMaxVolume: maxBidPrice,
                }
            }

            return solidityInfo;
        } else {
            return null
        }
    }

    static FindAllSolidity = async () => {
        const symbols = await this.FetchAllSymbols(10**8);
        const symbolsWithSolidity: string[] = [];

        for (const symbol of symbols) {
            const solidityInfo = await this.FindSolidity(symbol, 0.5);
            if (solidityInfo !== null) {
                symbolsWithSolidity.push(symbol);
            }

        }
        return symbolsWithSolidity;
    }

}
