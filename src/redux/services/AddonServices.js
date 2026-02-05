import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        getAllAddonGroupsApi: (outletId) => {
            return Api.get(`/menu/addon-groups/outlet/${outletId}`);
        },
    };
