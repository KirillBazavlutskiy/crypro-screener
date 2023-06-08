import axios from "axios";

const domen: string = process.env.BINANCE_DOMEN || 'US';

export const BinanceAPI = axios.create({
    baseURL: `https://api.binance.${domen.toLowerCase()}/api/v3`,
})
