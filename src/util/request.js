import axios from 'axios';
import Config from './config';
import profileStore from '../Store/profileStore';

export const request = (url = "", method = "", data = {}) => {

    // ✅ Get token from zustand store
    const access_token = profileStore.getState().access_token;

    // ✅ Set headers correctly
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

    // ✅ Attach token if exists
    if (access_token) {
        headers['Authorization'] = `Bearer ${access_token}`;
        headers['Authorization'] = `Bearer ${access_token}`;
    }

    return axios({
        url: Config.base_url + url,
        method: method,
        data: data,
        headers: headers,   // ✅ must be headers: headers — not ...headers
    })
    .then(res => {
        return res.data;
    })
    .catch((error) => {
        const response = error.response;

        if (response) {
            const status = response.status;
            const data   = response.data;
            let errors   = {};

            // ✅ Handle 401 Unauthorized — token expired or invalid
            if (status === 401) {
                profileStore.getState().logout();
                window.location.href = '/login';
                return;
            }

            if (data.errors) {
                Object.keys(data.errors).map((key) => {
                    errors[key] = {
                        validateStatus: 'error',
                        help: data.errors[key][0],
                        hasFeedback: true,
                    };
                });
            }

            return {
                status: status,
                errors: errors,
            };
        }
    });
};

