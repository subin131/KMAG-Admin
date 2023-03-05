import axios from "axios";
const endpoint = `${process.env.REACT_APP_HOST_URL}/payment`;
const limit = 10;

export const getAllCards = (data) => {
  const options = {
    method: "get",
    url: `${endpoint}/cardgenerate?status=${data.status}&packageId=${data.packageId}&page=${data.page}&limit=${limit}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  return axios(options);
};

export const postNewCard = (data) => {
  const options = {
    method: "post",
    url: `${endpoint}/cardgenerate`,
    data: data,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};
