import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        getAllSectionsApi: (id) => {
            return Api.get(`/outlets/4/sections`);
        },
    };
