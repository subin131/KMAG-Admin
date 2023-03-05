import axios from "axios";

const endpoint = `${process.env.REACT_APP_HOST_URL}/read`;
const token = localStorage.getItem("token");
axios.defaults.headers.common["Authorization"] = "Bearer " + token;
const limit = 10;

export const addbook = (data) => {
  const options = {
    method: "post",
    url: `${endpoint}/book`,
    data: data,
  };
  return axios(options);
};

export const getAllBooks = (data) => {
  const options = {
    method: "get",
    url: `${endpoint}/admin/book?status=${data.status}&page=${data.page}&limit=${limit}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const getBookById = (data) => {
  const options = {
    method: "get",
    url: `${endpoint}/book/${data.bookId}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const getAllChaptersByBookId = (data) => {
  const options = {
    method: "get",
    url: `${endpoint}/admin/chapter/${data.bookId}?status=${data.status}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const addChapter = (data, bookId) => {

  const options = {
    method: "post",
    url: `${endpoint}/chapter/${bookId}`,
    data: data,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};


export const getChapterById=(data)=>{
  const options = {
    method: "get",
    url: `${endpoint}/chapter/${data.chapterId}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
}

export const addSection = (data, chapterId) => {

  const options = {
    method: "post",
    url: `${endpoint}/section/${chapterId}`,
    data: data,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export  const getSectionById=(data)=>{
  const options = {
    method: "get",
    url: `${endpoint}/section/${data.sectionId}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
}

export const getAllSectionsByChapterId = (data,chapterId) => {
  const options = {
    method: "get",
    url: `${endpoint}/admin/section/${chapterId}/?status=${data.status}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const deleteBookById = (bookId) => {
  const options = {
    method: "delete",
    url: `${endpoint}/book/${bookId}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const deleteChapterById = (bookId,chapterId) => {
  const options = {
    method: "delete",
    url:`${endpoint}/chapter/${bookId}/${chapterId}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};

export const deleteSectionById = (chapterId,sectionId) => {
  const options = {
    method: "delete",
    url:`${endpoint}/section/${chapterId}/${sectionId}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
};



export const updateBookById=(data)=> {
  const options = {
    method: "put",
    url: `${endpoint}/book/${data.bookId}`,
    data: data.formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
}

export const updateChapterById=(data)=> {
  const options = {
    method: "put",
    url: `${endpoint}/chapter/${data.bookId}/${data.chapterId}`,
    data: data.formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
}
export const updateSectionById=(data)=> {
  const options = {
    method: "put",
    url: `${endpoint}/section/${data.chapterId}/${data.sectionId}`,
    data: data.formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return axios(options);
}