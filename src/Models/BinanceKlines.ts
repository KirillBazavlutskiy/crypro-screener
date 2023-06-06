export interface CandleStickData {
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export type BinanceDataKline = [
    Date,
    string,
    string,
    string,
    string,
    string,
    number,
    string,
    number,
    string,
    string,
    string
];
