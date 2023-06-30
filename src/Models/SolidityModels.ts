export interface SolidityModel {
    symbol: string;
    quoteVolume: number;
    buyVolume: number;
    sellVolume: number;
    solidityLong?: SolidityTicket;
    solidityShort?: SolidityTicket;
}

export interface SolidityTicket {
    price: number;
    volume: number;
}
