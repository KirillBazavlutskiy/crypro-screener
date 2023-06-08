import axios from "axios";

const domen: string = process.env.BINANCE_DOMEN || 'COM';

export const BinanceAPI = axios.create({
    baseURL: `https://api.binance.${domen.toLowerCase()}/api/v3`
});

// BinanceAPI.interceptors.request.use(config => {
//     const domen: string = process.env.BINANCE_DOMEN || 'COM';
//     config.baseURL = `https://api.binance.${domen.toLowerCase()}/api/v3`
//     return config;
// })
