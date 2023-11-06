export interface SolidityModel {
    symbol: string;
    solidity: SolidityTicket;
}

export interface SolidityTicket {
    price: number;
    ratio: number;
    volume: number;
}
