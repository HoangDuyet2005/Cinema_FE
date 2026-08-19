import { Suspense, lazy } from "react";

import { BrowserRouter, Switch, Route } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";

import ModalTrailer from "./components/ModalTrailer";
import TriggerLoadingLazy from "./components/TriggerLoadingLazy";
import Loading from "./components/Loading";
import { theme } from "./constants/config";
import PaymentUser from "./pages/PaymentUser";
// import CategoryManagement from "./pages/CategoryManagement";
// import { getAllByAltText } from "@testing-library/react";

// layout
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const AuthLayout = lazy(() => import("./layouts/AuthLayout"));
const AuthLayoutAdmin = lazy(() => import("./layouts/AuthLayoutAdmin"));
const AuthLayoutStaff = lazy(() => import("./layouts/AuthLayoutStaff"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const StaffLayout = lazy(() => import("./layouts/StaffLayout"));
// guards
const AdminRoute = lazy(() => import("./guards/AdminRoute"));
const StaffRoute = lazy(() => import("./guards/StaffRoute"));
const CheckoutRoute = lazy(() => import("./guards/CheckoutRoute"));
const UserProfileRoute = lazy(() => import("./guards/UserProfileRoute"));
// page
const Homepage = lazy(() => import("./pages/Homepage"));
const AllMovieSearch = lazy(() => import("./pages/AllMovieSearch"));
const ReviewAll = lazy(() => import("./pages/ReviewAll"));
const EventAll = lazy(() => import("./pages/EventAll"));
const BookAll = lazy(() => import("./pages/BookAll"));
const BookAllFix = lazy(() => import("./pages/BookAllFix"));
const MovieDetail = lazy(() => import("./pages/MovieDetail"));
const ReviewerDetail = lazy(() => import("./pages/ReviewerDetail"));
const ReviewMovie = lazy(() => import("./pages/ReviewMovie"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const BookTickets = lazy(() => import("./pages/Bookticket"));
const BookTicketsDetail = lazy(() => import("./pages/BookticketDetail"));
const BookTicketsByStaff = lazy(() => import("./pages/BookticketStaff"));
const UsersManagement = lazy(() => import("./pages/UsersManagement"));
const DashBoard = lazy(() => import("./pages/DashBoard/Components/Dashboard"));
const ReviewsManagement = lazy(() => import("./pages/ReviewsManagement"));
const BillsManagement = lazy(() => import("./pages/BillsManagement"));
const EventsManagement = lazy(() => import("./pages/EventsManagement"));
const MoviesManagement = lazy(() => import("./pages/MoviesManagement"));
const CategoryManagement = lazy(() => import("./pages/CategoryManagement"));
const BranchManagement = lazy(() => import("./pages/BranchManagement"));
const BookByStaff = lazy(() => import("./pages/BookByStaff"));
const CreateShowtime = lazy(() => import("./pages/CreateShowtime"));
const TicketManagement = lazy(() => import("./pages/TicketManagement"));
const Login = lazy(() => import("./pages/Login"));
const LoginAdmin = lazy(() => import("./pages/LoginAdmin"));
const LoginStaff = lazy(() => import("./pages/LoginStaff"));
const Register = lazy(() => import("./pages/Register"));
const DetailNews = lazy(() => import("./pages/DetailNews"));
const NewsDetail = lazy(() => import("./pages/NewsDetail"));
const DetailReview = lazy(() => import("./pages/DetailReview"));
// const DetailEvent = lazy(() => import("./pages/DetailEvent"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <Loading />
        {/* Modal */}
        <ModalTrailer />
        <Suspense fallback={<TriggerLoadingLazy />}> 
          <Switch>
            <Route exact path={["/reviewer/:maPhim" ,"/search/:search", "/", "/phim/:maPhim", "/taikhoan", "/review/:maTin", "/schedule", "/review", "/bookall", "/event-all", "/phim/:maPhim/write-review", "/detail-review/:maTin", "payment/:maBill/total", "/detail-news/:maTin"]}>
              <MainLayout>
                <Route exact path="/" component={Homepage} />
                <Route exact path="/review" component={ReviewAll} />
                <Route exact path="/event-all" component={EventAll} />
                <Route exact path="/search/:searchItem" component={AllMovieSearch} />
                <Route exact path="/schedule" component={BookAll} />
                <Route exact path="/bookall" component={BookAllFix} />
                <Route exact path="/phim/:maPhim" component={MovieDetail} />
                <Route exact path="/reviewer/:maPhim" component={ReviewerDetail} />
                <Route exact path="/phim/:maPhim/write-review" component={ReviewMovie} />
                <Route exact path="/review/:maTin" component={DetailNews} />
                <Route exact path="/detail-review/:maTin" component={DetailReview} />
                <Route exact path="/detail-news/:maTin" component={NewsDetail} />
                <UserProfileRoute
                  exact
                  path="/taikhoan"
                  component={UserProfile}
                />
              </MainLayout>
            </Route>

            <CheckoutRoute
              exact
              path="/datve/:maLichChieu/:maPhim"
              component={BookTickets}
            />

            <CheckoutRoute
              exact
              path="/datvechitiet/:maLichChieu/:maRap/:maPhim/:ngayChieu/:maPhong/:gioChieu"
              component={BookTicketsDetail}
            />

            <CheckoutRoute
              exact
              path="/payment/:maBill/:total"
              component={PaymentUser}
            />

            <Route
              exact
              path={["/admin/branch","/admin/category", "/admin/bills", "/admin/users", "/admin/movies", "/admin/showtimes", "/admin/reviews", "/admin/ticket", "/admin/events", "/admin/dashboard", "/admin/book/:maLichChieu/:maRap/:maPhim/:ngayChieu/:maPhong/:gioChieu", "/admin/book/"]}
            >
              <AdminLayout>
                <AdminRoute
                  exact
                  path="/admin/dashboard"
                  component={DashBoard}
                />
                <AdminRoute
                  exact
                  path="/admin/users"
                  component={UsersManagement}
                />
                <AdminRoute
                  exact
                  path="/admin/movies"
                  component={MoviesManagement}
                />
                <AdminRoute
                  exact
                  path="/admin/showtimes"
                  component={CreateShowtime}
                />
                <AdminRoute
                  exact
                  path="/admin/reviews"
                  component={ReviewsManagement}
                />
                <AdminRoute
                  exact
                  path="/admin/bills"
                  component={BillsManagement}
                />
                <AdminRoute
                  exact
                  path="/admin/ticket"
                  component={TicketManagement}
                />
                <AdminRoute
                  exact
                  path="/admin/events"
                  component={EventsManagement}
                />
                <CheckoutRoute
                exact
                path="/admin/book/:maLichChieu/:maRap/:maPhim/:ngayChieu/:maPhong/:gioChieu"
                component={BookTicketsByStaff}
               />
                <AdminRoute
                  exact
                  path="/admin/category"
                  component={CategoryManagement}
                />
                <AdminRoute
                  exact
                  path="/admin/branch"
                  component={BranchManagement}
                />
              </AdminLayout>
            </Route>

            <Route
              exact
              path={["/staff/branch","/staff/category", "/staff/bills","/staff/movies", "/staff/book", "/staff/reviews", "/staff/book/:maLichChieu/:maRap/:maPhim/:ngayChieu/:maPhong/:gioChieu", "/staff/showtimes", "/staff/ticket", "/staff/events", "/staff/book/"]}
            >
              <StaffLayout>
                <StaffRoute
                  exact
                  path="/staff/movies"
                  component={MoviesManagement}
                />
                <StaffRoute
                  exact
                  path="/staff/book"
                  component={BookByStaff}
                />
                <StaffRoute
                  exact
                  path="/staff/showtimes"
                  component={CreateShowtime}
                />
                <StaffRoute
                  exact
                  path="/staff/reviews"
                  component={ReviewsManagement}//viet
                />
                <StaffRoute
                  exact
                  path="/staff/events"
                  component={EventsManagement}
                />
                <StaffRoute
                  exact
                  path="/staff/bills"
                  component={BillsManagement}
                />
                <StaffRoute
                  exact
                  path="/staff/ticket"
                  component={TicketManagement}
                />
                <StaffRoute
                  exact
                  path="/staff/category"
                  component={CategoryManagement}
                />
                <StaffRoute
                  exact
                  path="/staff/branch"
                  component={BranchManagement}
                />
                <CheckoutRoute
                exact
                path="/staff/book/:maLichChieu/:maRap/:maPhim/:ngayChieu/:maPhong/:gioChieu"
                component={BookTicketsByStaff}
               />
              </StaffLayout>


            </Route>


          {/* Author */}
            <Route exact path={["/dangnhap", "/dangky"]}>
              <AuthLayout>
                <Route exact path="/dangnhap" component={Login} />
                <Route exact path="/dangky" component={Register} />
              </AuthLayout>
            </Route>

            <Route exact path={["/admin"]}>
              <AuthLayoutAdmin>
                <Route exact path="/admin" component={LoginAdmin} />
              </AuthLayoutAdmin>
            </Route>

            <Route exact path={["/staff"]}>
              <AuthLayoutStaff>
                <Route exact path="/staff" component={LoginStaff} />
              </AuthLayoutStaff>
            </Route>

            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </MuiThemeProvider>
    </BrowserRouter>
  );
}

export default App;
