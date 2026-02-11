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
      addUserApi:(values) => {
        return Api.post(`/users`,values)
      }
    };
