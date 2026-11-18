
const apiBaseUrl = import.meta.env.VITE_API_URL
    || 'https://laravel-api-alpha.vercel.app/api/';
const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL
    || 'https://laravel-api-alpha.vercel.app/storage/';

const Config = {
    base_url: apiBaseUrl.endsWith('/') ? apiBaseUrl : `${apiBaseUrl}/`,
    imgPath: imageBaseUrl.endsWith('/') ? imageBaseUrl : `${imageBaseUrl}/`,
    getImage(image) {
        if (!image) return '';

        const value = String(image).trim();
        if (/^https?:\/\//i.test(value)) return value;

        const path = value.replace(/^\/+/, '').replace(/^storage\//i, '');
        return `${this.imgPath}${path}`;
    },
}

export default Config;