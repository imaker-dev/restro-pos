import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        getAllItemsByCategoryApi:(categoryId) => {
            return Api.get(`/menu/items/category/${categoryId}`)
        },
        createItemApi:(values) => {
            return Api.post(`/menu/items`,values)
        },
        updateItemApi:(id,values) => {
            return Api.patch(`/menu/items/${id}`,values)
        }
    };
