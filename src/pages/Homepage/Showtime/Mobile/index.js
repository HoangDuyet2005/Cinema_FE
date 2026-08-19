import React, { useEffect, useState } from "react";

import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";

import useStyles from "./style";
import BlockRating from "../../../../components/BlockRating";

export default function Mobile({ arrayData, value }) {
  const [data, setData] = useState({ dailyMovieList: [], comingMovieList: [] });
  const [openMore, setopenMore] = useState(false);
  const classes = useStyles({ openMore });
  const history = useHistory();

  useEffect(() => {
    const dailyMovieList = arrayData?.dailyMovieList?.data?.slice(0, 3);
    const comingMovieList = arrayData?.comingMovieList?.data?.slice(0, 3);
    const dailyMovieListMore = arrayData?.dailyMovieList?.data;
    const comingMovieListMore = arrayData?.comingMovieList?.data;
    if (!openMore) {
      setData((data) => ({ ...data, dailyMovieList, comingMovieList }));
    }
    if (openMore) {
      setData((data) => ({
        ...data,
        dailyMovieList: dailyMovieListMore,
        comingMovieList: comingMovieListMore,
      }));
    }
  }, [openMore, arrayData]);

  const renderMovie = () => {
    const list = value.value ? data?.comingMovieList : data?.dailyMovieList;
    return list?.map((item) => (
      <div className={classes.movieItem} key={item.id}>
        <div
          className={classes.movieContent}
          onClick={() =>
            history.push(`/phim/${item.id}`, { comingMovie: value.value })
          }
        >
          <div
            className={classes.bgImg}
            style={{ backgroundImage: `url(${item.largeImageURL})` }}
          ></div>
          <BlockRating danhGia={10} />
          <span className={classes.c18}>{item?.name}</span>
        </div>
      </div>
    ));
  };

  return (
    <>
      {renderMovie()}
      <div className={classes.moreMovie}>
        <Button
          variant="outlined"
          onClick={() => setopenMore(true)}
          className="btn-xem-them-global"
        >
          XEM THÊM
        </Button>
      </div>
    </>
  );
}
