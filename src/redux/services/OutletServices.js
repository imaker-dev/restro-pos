import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        getAllOutletsApi: () => {
            return Api.get("/outlets");
        },
        getOutletById: (id) => {
            return Api.get(`/outlets/${id}`);
        },
        createOutletApi:(values) => {
            return Api.post(`/outlets`,values)
        },
        updateOutletApi:(id,values) => {
            return Api.put(`/outlets/${id}`,values)
        }
    };
