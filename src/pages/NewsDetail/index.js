import React, { useEffect, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import useMediaQuery from '@material-ui/core/useMediaQuery';

// import { getMovieDetails, getMovieShowtimes } from '../../reducers/actions/MovieDetail';
import { DISPLAY_MOBILE_HOMEPAGE } from '../../constants/config'
// import { RESET_MOVIEDETAIL_REDUCER, RESET_MOVIE_DETAIL_REDUCER } from '../../reducers/constants/MovieDetail';
// import Mobile from './Mobile';
// import Desktop from './Desktop';
// import { logger } from 'workbox-core/_private';
import { getEventsDetail, getEventsList } from '../../reducers/actions/EventsManagement';
import TinTucDetailComponent from '../../components/TinTucDetailComponent/TinTucDetailComponent';

export default function Index() {
  const isMobile = useMediaQuery(DISPLAY_MOBILE_HOMEPAGE)
  // const { movieDetailShowtimes, errorMovieDetailShowtimes } = useSelector((state) => state.movieDetailReducer);
  // console.log("Xuất Detail của movie: ", movieDetailShowtimes);

  const { eventDetail, errorEventDetail } = useSelector((state) => state.eventsManagementReducer);
  console.log("eventDetail: ", eventDetail);

  // const { movieDetail } = useSelector((state) => state.movieDetailReducer);
  // console.log("Xuất Movie Detail của movieID: ", movieDetail);
  let [loading, setLoading] = useState(true);
  const param = useParams()
  console.log(param.maTin);
  const dispatch = useDispatch();
  
  useEffect(function () {
    // dispatch(getMovieShowtimes(param.maPhim))
    // console.log("useEF");
    dispatch(getEventsDetail(param.maTin))
    setLoading(false);

  }, [])



  if (errorEventDetail) {
    return <div>{errorEventDetail}</div>
  }
    return (
    // <>
    //   {/* {  isMobile ? <Mobile movieDetailShowtimes={null} isMobile={isMobile} /> 
    //       :  */}
    //         <Desktop movieDetailShowtimes={eventDetail?.data} isMobile={isMobile} />
    //   {/* } */}
    // </>
    <>
        <TinTucDetailComponent tinTuc={eventDetail?.data} />
    </>
  )
}
