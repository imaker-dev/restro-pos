import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        getAllOutletsApi: () => {
            return Api.get("/outlets");
        },
        updateOutletApi:(id,values) => {
            return Api.put(`/outlets/${id}`,values)
        }
    };
