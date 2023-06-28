import axios from "axios";

export const BinanceAPI = axios.create({
    baseURL: `https://api.binance.com/api/v3`
});
