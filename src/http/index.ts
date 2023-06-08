import axios from "axios";

export const BinanceAPI = axios.create({
    baseURL: `https://api.binance.${process.env.BINANCE_DOMEN}/api/v3`,
})
