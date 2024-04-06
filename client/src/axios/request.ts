import axios from "axios";

export const instanceApi = axios.create({
    baseURL: 'https://d5dp952oufmhv72m6ap2.apigw.yandexcloud.net/api',
});
