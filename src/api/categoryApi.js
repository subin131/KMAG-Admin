import axios from "axios";

const endpoint = `${process.env.REACT_APP_HOST_URL}/content/category`;

const limit = 10;

export const getAllCategory = (data) => {
  const options = {
    method: "get",
    url: `${endpoint}/?page=${data.page}&limit=${data.limit || limit}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const getCategoryById = (categoryId) => {
  const options = {
    method: "get",
    url: `${endpoint}/${categoryId}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const postCategory = (data) => {
  const options = {
    method: "post",
    url: `${endpoint}`,
    data: data,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const deleteCategory = (userId) => {
  const options = {
    method: "delete",
    url: `${endpoint}/${userId}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const editCategory = (data) => {
  const options = {
    method: "put",
    url: `${endpoint}/${data.userId}`,
    data: data.body,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};
