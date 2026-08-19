import axiosClient from "./axiosClient";

const eventsApi = {

  getListEvent: () => {
    const path = "/article/getAll";
    return axiosClient.get(path);
  },

  getListEventManagment: () => {
    const path = "/article/getAllPaging?page=0&size=40&articleType=NEWS";
    return axiosClient.get(path);
  },

  getDetailEvent: (id) => {
    const path = `/article/getDetail?id=${id}`;
    return axiosClient.get(path);
  },

  postAddEvent: (event) => {
    const path = "/article/addNew";
    return axiosClient.post(path, event);
  },

  postAddReview: (review) => {
    const path = "/article/addNewReview";
    return axiosClient.post(path, review);
  },

  deleteEvent: (event) => {
    const path = ``;

    return axiosClient.delete(path);
  },

  putEditEvent: (event) => {
    // console.log(event);
    const path = `/article/update`;
    return axiosClient.put(path, event);
  },

  addSaveArticle: (param) => {
    const path = `/article/user/addSaveArticle?userId=${param.userId}&articleId=${param.articleId}`;
    return axiosClient.post(path);
  },

  checkSaveArticle: (param) => {
    const path = `/article/user/checkSaveArticle?userId=${param.userId}&articleId=${param.articleId}`;
    return axiosClient.get(path);
  },

  checkSaveArticle: (param) => {
    const path = `/article/user/checkSaveArticle?userId=${param.userId}&articleId=${param.articleId}`;
    return axiosClient.get(path);
  },

  getAllSavedArticle: (param) => {
    const path = `/article/user/saveArticle/getAll?userId=${param}&page=0&size=20`;
    return axiosClient.get(path);
  },

  getAll: (id) => {
    const path = `/article/user/getAll`;
    return axiosClient.get(path);
  },
};

export default eventsApi;
