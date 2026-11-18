import axios from 'axios';
import Config from './config';
import profileStore from '../Store/profileStore';

export const request = (url = "", method = "", data = {}) => {
    const access_token = profileStore.getState().access_token;

    let headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    if (data instanceof FormData) {
        headers = {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        };
    }

    if (access_token) {
        headers['Authorization'] = 'Bearer ' + access_token;
    }

    return axios({
        url: Config.base_url + url,
        method: method,
        data: data,
        headers: headers,
    })
    .then(res => res.data)
    .catch((error) => {
        const response = error?.response;
        if (!response) return { status: 0, errors: {} };
        const status = response.status;
        const data   = response.data;
        let errors   = {};

        if (status === 401) {
            profileStore.getState().logout();
            window.location.href = '/login';
            return;
        }

        if (data?.errors) {
            Object.keys(data.errors).forEach((key) => {
                errors[key] = {
                    validateStatus: 'error',
                    help: data.errors[key][0],
                    hasFeedback: true,
                };
            });
        }

        return { status, errors };
    });
};
