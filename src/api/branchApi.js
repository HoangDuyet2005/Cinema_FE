import axiosClient from "./axiosClient";

const branchApi = {

  getListBranchByAdminStaff: () => {
    const path = `/branches/getList`;
    return axiosClient.get(path);
  },
  getBranchByMovie: (id) => {
    const path = `/branches?movieId=${id}`;
    return axiosClient.get(path);
  },
  getAllBranch: (id) => {
    const path = `/branches/getAll?page=0&size=20`;
    return axiosClient.get(path);
  },
  schedule: (params) => {
    const path = `/schedule?movieId=${params.id}&branchId=${params.branch}&startDate=${params.date}`;
    return axiosClient.get(path);
  },

};

export default branchApi;
