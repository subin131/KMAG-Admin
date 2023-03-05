import axios from "axios";

const endpoint = `${process.env.REACT_APP_HOST_URL}/content`;
const limit = 10;

export const createContent = (formData) => {
  const options = {
    method: "post",
    url: `${endpoint}`,
    data: formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const getAllContent = (data) => {
  let url;
  if (data.included_in_book) {
    url = `${endpoint}/admin?type=${data.type}&page=${data.page}&limit=${data.limit || limit}&group=${data.group}&status=${data.status}&categoryId=${data.categoryId}&included_in_book=${data.included_in_book}`;
  } else {
    url = `${endpoint}/admin?type=${data.type}&page=${data.page}&limit=${data.limit || limit}&group=${data.group}&status=${data.status}&categoryId=${data.categoryId}`;
  }
  const options = {
    method: "get",
    url: url,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const getContentById = (contentId) => {
  const options = {
    method: "get",
    url: `${endpoint}/${contentId}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const editContent = (data) => {
  const options = {
    method: "put",
    url: `${endpoint}/${data.id}`,
    data: data.formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const deleteContent = (contentId) => {
  const options = {
    method: "delete",
    url: `${endpoint}/${contentId}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const uploadImage = (data) => {
  const options = {
    method: "post",
    url: `${endpoint}/file-upload`,
    data: data,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const putMaintainence = (data) => {
  const options = {
    method: "put",
    url: `${endpoint}/getconfiguration`,
    data: data,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const getMaintainence = () => {
  const options = {
    method: "get",
    url: `${endpoint}/getconfiguration`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};


export const getContentForSection = (data) => {
  const options = {
    method: "get",
    url: `${endpoint}/admin/section?limit=${data.limit}&search=${data.search}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};
