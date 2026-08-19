import React, { useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { getMovieDetails } from '../../reducers/actions/MovieDetail';
import { DISPLAY_MOBILE_HOMEPAGE } from '../../constants/config'
import { RESET_MOVIE_DETAIL_REDUCER } from '../../reducers/constants/MovieDetail';
import Mobile from './Mobile';
import Desktop from './Desktop';

export default function Index() {
  const isMobile = useMediaQuery(DISPLAY_MOBILE_HOMEPAGE)
  const { movieDetail, errorMovieDetail } = useSelector((state) => state.movieDetailReducer);
  console.log("Review: ", movieDetail);
  const param = useParams()
  console.log(param);
  const dispatch = useDispatch();
  
  useEffect(function () {
    // dispatch(getMovieShowtimes(param.maPhim))
    console.log("useEF");
    dispatch(getMovieDetails(param.maPhim))
    return () => {
      dispatch({type: RESET_MOVIE_DETAIL_REDUCER})
    }
  }, [])


  if (errorMovieDetail) {
    return <div>{errorMovieDetail}</div>
  }
    return (
    <>
      {/* {  isMobile ? <Mobile movieDetailShowtimes={movieDetail.data} isMobile={isMobile} /> 
          :  */}
            <Desktop movieDetailShowtimes={movieDetail.data} isMobile={isMobile} />
            {/* } */}
    </>
  )
}
