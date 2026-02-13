import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllTableApi: (id) => {
        return Api.get(`/tables/floor/${id}`); //floor ID
      },
      createTableApi: (values) => {
        return Api.post(`/tables`, values);
      },
      updatedTableApi: (tableId, values) => {
        return Api.put(`/tables/${tableId}`, values);
      },
    };
