import axios from "axios";

export const BinanceAPI = axios.create({
    baseURL: `https://api.binance.us/api/v3`,
})
