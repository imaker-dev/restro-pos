import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        getAllItemsByCategoryApi:(categoryId) => {
            return Api.get(`/menu/items/category/${categoryId}`)
        }
    };
