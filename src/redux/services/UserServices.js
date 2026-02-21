import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllUsersApi: (page, limit, search) => {
        let url = `/users?page=${page}&limit=${limit}`;

        if (search && search.trim()) {
          url += `&search=${encodeURIComponent(search.trim())}`;
        }

        return Api.get(url);
      },
      getUserByIdApi: (userId) => {
        return Api.get(`/users/${userId}`);
      },
      addUserApi: (values) => {
        return Api.post(`/users`, values);
      },
      updateUserApi: (id, values) => {
        return Api.put(`/users/${id}`, values);
      },
    };
