interface SymbolFilter {
    filterType: string;
    maxPrice?: string;
    minPrice?: string;
    tickSize?: string;
    multiplierUp?: string;
    multiplierDown?: string;
    avgPriceMins?: number;
    minQty?: string;
    maxQty?: string;
    stepSize?: string;
    minNotional?: string;
    applyToMarket?: boolean;
    limit?: number;
    maxNumOrders?: number;
    maxNumAlgoOrders?: number;
    maxNumIcebergOrders?: number;
    maxNumSandboxOrders?: number;
    maxNumIcebergAlgoOrders?: number;
    maxNumNormalAlgoOrders?: number;
}

export interface Symbol {
    symbol: string;
    status: string;
    baseAsset: string;
    baseAssetPrecision: number;
    quoteAsset: string;
    quotePrecision: number;
    quoteAssetPrecision: number;
    baseCommissionPrecision: number;
    quoteCommissionPrecision: number;
    orderTypes: string[];
    icebergAllowed: boolean;
    ocoAllowed: boolean;
    quoteOrderQtyMarketAllowed: boolean;
    isSpotTradingAllowed: boolean;
    isMarginTradingAllowed: boolean;
    filters: SymbolFilter[];
    permissions: string[];
}

export interface ExchangeInfo {
    timezone: string;
    serverTime: number;
    rateLimits: any[];
    exchangeFilters: any[];
    symbols: Symbol[];
}
