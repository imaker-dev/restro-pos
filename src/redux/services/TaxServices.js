import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        getAllTaxGroupsApi: () => {
            return Api.get(`/tax/groups`);
        },
        getTaxGroupByIdApi:(id) => {
            return Api.get(`/tax/groups/${id}`)
        }
    };
