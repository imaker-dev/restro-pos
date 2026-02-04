import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        getAllFloorsApi: (id) => {
            return Api.get(`/outlets/${id}/floors`);
        },
    };
