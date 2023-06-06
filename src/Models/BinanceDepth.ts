type OrderBookEntry = [
    string,
    string
]
export interface OrderBook {
    lastUpdateId: number;
    bids: OrderBookEntry[];
    asks: OrderBookEntry[];
}

interface SolidityInfo {
    maxVolume: number,
    priceOnMaxVolume: number,
}

export interface FindSolidityFuncReturn {
    ask?: SolidityInfo,
    bid?: SolidityInfo
}
