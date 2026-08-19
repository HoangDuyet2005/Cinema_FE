import axiosClient from "./axiosClient";

const interactionApi = {

  checkUserLikeOrUnlike : (userId, articleId) => {
    const path = `/interaction/v1/like/checkUser?userId=${userId}&articleId=${articleId}`;
    return axiosClient.get(path);
  },

  getAllLikeBaiViet: (articleId) => {
    const path = `/interaction/v1/like/getAll/${articleId}`;
    return axiosClient.get(path);
  },

  getAllCommentBaiViet: (articleId) => {
    const path = `/interaction/v1/comment/getAll/${articleId}?page=0&size=20`;
    return axiosClient.get(path);
  },

  postLikeVaHuyThichBaiViet: (data) => {
    const path = `/interaction/v1/like/add`;
    return axiosClient.post(path, data);
  },

  putDeleteComment: (id) => {
    const path = `/interaction/v1/comment/${id}`;
    return axiosClient.delete(path);
  },

  putEditComment: (data) => {
    const path = `/interaction/v1/comment/update`;
    return axiosClient.put(path, data);
  },

  postThemComment: (data) => {
    const path = `/interaction/v1/comment/add`;
    return axiosClient.post(path, data);
  },

};

export default interactionApi;
