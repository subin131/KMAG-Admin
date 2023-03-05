import axios from "axios";

const endpoint = `${process.env.REACT_APP_HOST_URL}/marketing/admin`;
const limit = 10;

export const getAllLeads = (data) => {
  const options = {
    method: "get",
    url: `${endpoint}?status=${data?.status || ""}&emailed=${
      data?.emailed || ""
    }&limit=${data?.limit || limit}&page=${data.page}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const addLeads = (data) => {
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

export const createMultipleLeads = (data) => {
  const options = {
    method: "post",
    url: `${endpoint}/multiple`,
    data: data,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const getLeadById = (data) => {
  const options = {
    method: "get",
    url: `${endpoint}/${data.leadId}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const editLeadById = (data) => {
  const options = {
    method: "put",
    url: `${endpoint}/${data.leadId}`,
    data: data.body,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const deleteLeadById = (data) => {
  const options = {
    method: "delete",
    url: `${endpoint}/${data.leadId}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const sendPromotionalEmails = (data) => {
  const options = {
    method: "post",
    url: `${endpoint}/promo`,
    data: data,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};
