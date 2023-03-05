import axios from "axios";

const endpoint = `${process.env.REACT_APP_HOST_URL}/subscription/admin`;
const limit = 10;

export const getAllSubscripitons = (data) => {
  const options = {
    method: "get",
    url: `${endpoint}?page=${data.page}&limit=${limit}&status=${data.status}&package=${data.package}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const getAllPackages = (data) => {
  const options = {
    method: "get",
    url: `${endpoint}/package?page=${data.page}&limit=${
      data.limit || limit
    }&status=${data.status}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};
