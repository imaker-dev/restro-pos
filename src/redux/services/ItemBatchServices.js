import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        getItemBatchApi: (itemId,page,limit) => {
            return Api.get(`/inventory/items/${itemId}/batches?page=${page}&limit=${limit}`);
        },
    };
