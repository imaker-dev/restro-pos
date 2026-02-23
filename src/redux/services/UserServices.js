import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllUsersApi: (page, limit, search,outletId) => {
        let url = `/users?page=${page}&limit=${limit}&outletId=${outletId}`;

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
