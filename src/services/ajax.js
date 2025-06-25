import {hosts} from "../env/Environment";
import axios from "axios";
import https from 'https';
export const Ajax = {
    contentType: 'application/json; charset=utf-8',

    host() {
        return hosts.api;
    },

    async updateOptions(option, data = null) {
        option = option || {};
        option.headers = option.headers || {};

        // Si ce n'est pas un FormData, on met Content-Type
        if (!(data instanceof FormData) && !option.headers['Content-Type']) {
            option.headers['Content-Type'] = this.contentType;
        }

        option.headers['Accept'] = 'application/json';

        const session = sessionStorage.getItem('session');
        if (session) {
            let { access_token } = JSON.parse(session);
            if (access_token) {
                option.headers['Authorization'] = `Bearer ${access_token}`;
            }
        }

        return option;
    },


    async getRequest(url, option) {
        option = await this.updateOptions(option);
        option.httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        })
        return axios.get(`${this.host()}${url}`, option);
    },

    async postRequest(path, data, option = {}) {
        option = await this.updateOptions(option, data);
        option.httpsAgent = new https.Agent({
            rejectUnauthorized: false // Désactivation de la vérification SSL
        });
        return axios.post(`${this.host()}${path}`, data, option);
    },


    async putRequest(path, data, option) {
        option = await this.updateOptions(option,data);
        option.httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        })
        return axios.put(`${this.host()}${path}`, data, option);
    },

    async deleteRequest(path, option) {
        option = await this.updateOptions(option);
        option.httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        })
        return axios.delete(`${this.host()}${path}`, option);
    },
};