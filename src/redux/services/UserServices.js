import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllUsersApi: (search) => {
        const params = search ? { search } : {};
        return Api.get("/users", { params });
      },
      getUserByIdApi: (userId) => {
        return Api.get(`/users/${userId}`);
      },
      addUserApi:(values) => {
        return Api.post(`/users`,values)
      },
      updateUserApi:(id,values) => {
        return Api.put(`/users/${id}`,values)
      }
    };
