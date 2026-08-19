import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import { NavLink, useHistory } from 'react-router-dom';

import useStyles from './style';
import Seperate from '../../../components/Seperate';
import { useDispatch, useSelector } from 'react-redux';
import { getEventsList } from '../../../reducers/actions/EventsManagement';

function TabPanel(props) {
  const { isMobile, children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      <Box p={0}>{children}</Box>
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
  const history = useHistory();

  const handlerSeeMore = () => {
    history.push('/event-all');
  };

  const newsItems = (eventList?.data?.content || []).filter(
    (event) =>
      event?.status === 'CREATE' &&
      event?.status !== 'DELETE' &&
      event?.type === 'NEWS'
  );

  return (
    <div className={classes.root} id="tintuc">
      <div className="galaxy-section-container">
        {/* Section Heading: | TIN TỨC KHUYẾN MÃI - Always visible */}
        <div className="galaxy-section-header">
          <span className="galaxy-title-bar"></span>
          <h2 className="galaxy-title-text">TIN TỨC KHUYẾN MÃI</h2>
        </div>

        <Fade timeout={400} in={true}>
          <TabPanel value={0} index={0}>
            {newsItems.length > 0 ? (
              <div className="row" style={{ margin: 0 }}>
                {newsItems.slice(0, 4).map((event, index) => (
                  <div
                    className={classes.repons}
                    key={index}
                    style={{ cursor: 'pointer', marginBottom: 20 }}
                  >
                    <NavLink
                      to={`/detail-news/${event?.id}`}
                      className={classes.newsCard}
                    >
                      <div className={classes.imgWrapper}>
                        <img
                          className={classes.fullImg}
                          src={event?.mainImage}
                          alt="news-movie"
                        />
                      </div>
                      <div className="py-2">
                        <h4 className={classes.newsTitle}>{event.brief}</h4>
                      </div>
                    </NavLink>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#888' }}>
                <p>Đang cập nhật tin tức khuyến mãi mới...</p>
              </div>
            )}

            {/* See More Button - Always rendered */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '10px',
              }}
            >
              <button
                className="btn-xem-them-global"
                type="button"
                onClick={handlerSeeMore}
              >
                Xem thêm
              </button>
            </div>
          </TabPanel>
        </Fade>
      </div>
    </div>
  );
}
