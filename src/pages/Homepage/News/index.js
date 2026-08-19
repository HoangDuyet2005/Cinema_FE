import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import { NavLink, useHistory } from 'react-router-dom';

import useStyles from './style'
import Seperate from '../../../components/Seperate';
import { useDispatch, useSelector } from 'react-redux';
import { getEventsList } from '../../../reducers/actions/EventsManagement';

function TabPanel(props) {
  const { isMobile, children, value, index, ...other } = props;
  return (<div hidden={value !== index}  {...other} >
    <Box p={(isMobile && index === 0) ? 1 : 3}>
      {children}
    </Box>
  </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default function SimpleTabs() {
  const dispatch = useDispatch();
  let {
    eventList,
    // loadingEventList,
    // loadingDelete,
    errorDelete,
    successDelete,
    successUpdateEvent,
    // errorUpdateEvent,
    // loadingUpdateEvent,
    // loadingAddEvent,
    successAddEvent,
    // errorAddEvent,
    // loadingUpdateNoneImageMovie,
    // successUpdateNoneImageMovie,
    // errorUpdateNoneImageMovie,
  } = useSelector((state) => state.eventsManagementReducer);


  useEffect(() => {
    if (
      !eventList ||
      successUpdateEvent ||
      // successUpdateNoneImageMovie ||
      successDelete ||
      errorDelete ||
      successAddEvent
    ) {
      dispatch(getEventsList());
    }
  }, []);

  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  // const [tinTuc, setTinTuc] = React.useState([]);
  const history = useHistory();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  // console.log(eventList);
  const handlerSeeMore =() =>{
    history.push("/event-all")
  }
  return (
    <div className={classes.root} id="tintuc">
      <Seperate />
      <div className={classes.content}>
        <AppBar className={classes.appBar} position="static" >
          <Tabs centered value={value} onChange={handleChange}>
            <Tab disableRipple classes={{ root: classes.tabButton, selected: classes.tabSelected }} label="Tin tức khuyến mãi" />
            {/* <Tab disableRipple classes={{ root: classes.tabButton, selected: classes.tabSelected }} label="Review" /> */}
            {/* <Tab disableRipple classes={{ root: classes.tabButton, selected: classes.tabSelected }} label="Phim 24 giờ" /> */}
          </Tabs>
        </AppBar>
        <Fade timeout={400} in={value === 0}>
          <TabPanel value={value} index={0}>
            {/* Nayf của event nè */}
            <div className="row">
              {
                eventList?.data?.content?.slice(0,5).map((event, index) => {
                  if(event?.status === "CREATE" && event?.status !== "DELETE"  && event?.type === "NEWS")
                  return(
                  <div className={classes.repons} key={index} style={{cursor: "pointer"}}>
                    <NavLink to={`/detail-news/${event?.id}`} className={classes.news}>
                      <img className={classes.fullImg} 
                      src={event?.mainImage} 
                      alt="news-movie" 
                      />
                      <div className="py-3">
                        <h4 className="card-title" style={{color:"#333"}}>
                          {event.brief}
                          </h4>
                        <p className="text-secondary" 
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis"
                          }}>
                        </p>
                      </div>
                    </NavLink>
                  </div>)
                })
              }
            </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <button className="btn-xem-them-global" type="button" onClick={handlerSeeMore}>Xem thêm</button>
          </div>
          </TabPanel>
        </Fade>

        {/* Này của PHIM 24 giờ
        <Fade timeout={400} in={value === 1}>
          <TabPanel value={value} index={1}>
            <div className="row">
              <div className={classes.repons}>
                <a href="#" className={classes.news}>
                  <img className={classes.fullImg} src="https://s3img.vcdn.vn/123phim/2020/08/review-tan-tich-quy-am-relic-ba-the-he-va-moi-lien-ket-15965255784224.png" alt="news-movie" />
                  <div className="py-3">
                    <h4  style={{color:"#333"}} className="card-title">[MORTAL KOMBAT: CUỘC CHIẾN SINH TỬ] - GỌI TÊN NHỮNG PHIM ĐIỆN ẢNH NỔI...</h4>
                    <p className="text-secondary">Cư dân nơi khác đang sắp “gato nổ mắt” với dân Sài Thành khi sắp tới đây thành phố HCM sẽ chào đón một rạp chiếu phim mang phong cách Artistic Urban Lifestyle đầu tiên tại Việt Nam!</p>
                  </div>
                </a>
              </div>
              <div className={classes.repons}>
                <a href="#" className={classes.news}>
                  <img className={classes.fullImg} src="https://s3img.vcdn.vn/123phim/2020/08/review-dinh-thu-oan-khuat-ghost-of-war-15965120886610.png" alt="news-movie" />
                  <div className="py-3">
                    <h4  style={{color:"#333"}} className="card-title">Review: Dinh Thự Oan Khuất (Ghost Of War)</h4>
                    <p className="text-secondary">Tuy là một bộ phim có chất lượng tốt, nhưng có vẻ Dinh Thự Oan Khuất vẫn chưa đủ để đem khán giả trở lại phòng vé!</p>
                  </div>
                </a>
              </div>
            </div>
          </TabPanel>
        </Fade> */}
      </div >
    </div >

  );
}
