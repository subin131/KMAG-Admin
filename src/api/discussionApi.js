import axios from "axios";

const endpoint = ` ${process.env.REACT_APP_HOST_URL}/discussion/question`;
const limit = 10;

export const addQuestion = (data) => {
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

export const getAllQuestions = (data) => {
  const options = {
    method: "get",
    url: `${endpoint}/?status=${data.status}&limit=10&page=${data.page}&categoryId=${data.categoryId}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const deleteQuestion = (userId) => {
  const options = {
    method: "delete",
    url: `${endpoint}/${userId}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const editQuestion = (data) => {
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

export const getQuestionsById = (data) => {
  const options = {
    method: "get",
    url: `${endpoint}/${data}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};
