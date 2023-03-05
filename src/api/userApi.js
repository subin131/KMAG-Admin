import axios from "axios";

const endpoint = `${process.env.REACT_APP_HOST_URL}/user/admin`;
const normalUserEndPoint = `${process.env.REACT_APP_HOST_URL}/user`;
const limit = 10;

export const getAllUser = (data) => {
  const options = {
    method: "get",
    url: `${endpoint}?userType=${data.userType}&status=${data.status}&page=${
      data.page
    }&country=${data.country || ""}&hasSubscription=${
      data.hasSubscription || ""
    }&email=${data.email || ""}&limit=${data.limit || limit}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const getUserDetail = () => {
  const options = {
    method: "get",
    url: `${normalUserEndPoint}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};
export const setupUserProfile = (data) => {
  const options = {
    method: "put",
    url: `${normalUserEndPoint}/profile`,
    data: data,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const editUser = (data) => {
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

export const loginUser = (data) => {
  const options = {
    method: "post",
    url: `${process.env.REACT_APP_HOST_URL}/user/login?keepAlive=${data.keepAlive}`,
    data: data.body,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const addUser = (data) => {
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

export const addNotification = (data) => {
  const options = {
    method: "post",
    url: `${process.env.REACT_APP_HOST_URL}/user/notification/send?status=${data.status}`,
    data: data.body,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

//graph api

export const getUserGraph = () => {
  const options = {
    method: "get",
    url: `${process.env.REACT_APP_HOST_URL}/user/graph/user?status=active`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const getContentGraph = () => {
  const options = {
    method: "get",
    url: `${process.env.REACT_APP_HOST_URL}/user/graph/content`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const getSubscriptionGraph = () => {
  const options = {
    method: "get",
    url: `${process.env.REACT_APP_HOST_URL}/user/graph/subscription`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const getAppDetails = () => {
  const options = {
    method: "get",
    url: `${process.env.REACT_APP_HOST_URL}/user/graph`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};
