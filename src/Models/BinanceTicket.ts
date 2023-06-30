export interface TradingPair {
    symbol: string;
    priceChange: string;
    priceChangePercent: string;
    weightedAvgPrice: number;
    prevClosePrice: number;
    lastPrice: number;
    lastQty: string;
    bidPrice: number;
    bidQty: string;
    askPrice: number;
    askQty: string;
    openPrice: number;
    highPrice: number;
    lowPrice: number;
    volume: number;
    quoteVolume: number;
    openTime: number;
    closeTime: number;
    firstId: number;
    lastId: number;
    count: number;
}
