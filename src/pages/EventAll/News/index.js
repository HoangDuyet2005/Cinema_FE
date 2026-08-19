import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';

import useStyles from './style'
import { getEventsList } from '../../../reducers/actions/EventsManagement';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

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
    errorDelete,
    successDelete,
    successUpdateEvent,
    successAddEvent,
  } = useSelector((state) => state.eventsManagementReducer);

  useEffect(() => {
    if (
      !eventList ||
      successUpdateEvent ||
      successDelete ||
      errorDelete ||
      successAddEvent
    ) {
      dispatch(getEventsList());
    }
  }, []);
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root} id="tintuc">
      <div className={classes.content}>
      <AppBar className={classes.appBar} position="static" >
          <Tabs centered value={value} onChange={handleChange}>
            <Tab disableRipple style={{backgroundColor:"white"}} classes={{ root: classes.tabButton, selected: classes.tabSelected }} label="Tin tức, khuyến mãi" />
          </Tabs>
        </AppBar>
        <Fade timeout={400} in={value === 0}>
          <TabPanel value={value} index={0}>
            <div className="row">
              {
                (eventList?.data?.content || eventList?.data || [])?.map((event, index) => {
                  if(event?.status === "APPROVE" && event?.status !== "DELETE"  && event?.type === "NEWS")
                  return(
                  <div className={classes.repons} key={index}>
                    <NavLink to={`/detail-news/${event?.id}`} className={classes.news}>
                      <img className={classes.fullImg} 
                      src={event?.mainImage} 
                      alt="news-movie" />
                      <div className="py-3">
                        <h4 className="card-title" style={{color:"white"}}>
                          {event.brief}
                          </h4>
                        <p className="text-secondary" 
                            style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                          }}>
                          {event?.title}
                          </p>
                      </div>
                    </NavLink>
                  </div>)
                })
              }
            </div>
          </TabPanel>
        </Fade>
      </div >
    </div >

  );
}

