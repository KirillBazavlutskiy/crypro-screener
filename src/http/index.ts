import axios from "axios";

export const BinanceAPI = axios.create();

BinanceAPI.interceptors.request.use(config => {
    const domen: string = process.env.BINANCE_DOMEN || 'COM';
    config.baseURL = `https://api.binance.${domen.toLowerCase()}/api/v3`
    return config;
})
