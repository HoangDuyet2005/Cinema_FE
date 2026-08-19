import axiosClient from "./axiosClient";

const categoryApi = {

  getListCategoryByAdminStaff: () => {
    const path = `/article/category/getAll`;
    return axiosClient.get(path);
  },

  addCategoryByAdminStaff: (name) => {
    // console.log(name);
    const path = `/article/category/add`;
    return axiosClient.post(path, name);
  },

};

export default categoryApi;
