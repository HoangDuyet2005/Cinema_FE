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
  getAllCities: () => {
    const path = `/branches/cities`;
    return axiosClient.get(path);
  },
  getBranchesByCity: (city) => {
    const path = city ? `/branches/by-city?city=${encodeURIComponent(city)}` : `/branches/by-city`;
    return axiosClient.get(path);
  },
};

export default branchApi;