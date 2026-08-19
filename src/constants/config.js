import { nanoid } from "nanoid";
import { createMuiTheme } from "@material-ui/core/styles";

const currentUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;
const avtIdUser = currentUser ? currentUser?.data?.avtIdUser : nanoid(10);
export { avtIdUser };
// export const BASE_URL = "https://WORLD CINEMA.azurewebsites.net/api";
export const BASE_URL = "http://localhost:8080/api";
// export const BASE_URL = "http://14.225.205.235:8080/api";
// export const BASE_URL = "https://api-WORLD CINEMAnew.tiktzuki.com/api";
export const FAKE_AVATAR = `https://vnn-imgs-f.vgcloud.vn/2020/03/23/11/trend-avatar-11.jpg`;
export const UNKNOW_USER = "https://cdn4.vectorstock.com/i/1000x1000/76/28/unknown-person-user-icon-for-web-vector-34757628.jpg";
export const DISPLAY_MOBILE_BOOKTICKET = "(max-width:768px)";
export const DISPLAY_MOBILE_THEATER = "(max-width:678px)";
export const HIDDEN_SEARCHTICKET = "(max-width:992px)";
export const DISPLAY_MOBILE_HOMEPAGE = "(max-width:736px)";

export const DATE_BEGIN_DANGCHIEU = "2020-01-01"; // format: yyyy-mm-dd
export const DATE_END_DANGCHIEU = "2020-12-01";

export const DATE_BEGIN_SAPCHIEU = "2020-12-02";
export const DATE_END_SAPCHIEU = new Date().toISOString()?.slice(0, 10);

export const arrayGiaVe = [75000, 100000, 120000, 150000];

export const theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 678,
      md: 736,
      lg: 768,
      xl: 992,
    },
  },
});

