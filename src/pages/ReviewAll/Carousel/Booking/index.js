import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
// import MenuItem from "@material-ui/core/MenuItem";
// import FormControl from "@material-ui/core/FormControl";
// import Select from "@material-ui/core/Select";
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
// import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
// import TextField from "@material-ui/core/TextField";
// import Autocomplete from "@material-ui/lab/Autocomplete";d
// import CustomPopper from "./popper";

// import theatersApi from "../../../../api/theatersApi";
// import useStyles from "./styles";
// import formatDate from "../../../../utilities/formatDate";
import { HIDDEN_SEARCHTICKET } from "../../../../constants/config";
// import { FormHelperText } from "@material-ui/core";
import Select from 'react-select'
import theatersApi from "../../../../api/theatersApi";
import { Autocomplete, Container, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import moviesApi from "../../../../api/moviesApi";
import { FormControl } from "@material-ui/core";

export default function Booking() {
  // const { movieList } = useSelector(
  //   (state) => state.movieReducer
  // );
  // console.log(movieList);

  // const history = useHistory();
  // const down992px = useMediaQuery(HIDDEN_SEARCHTICKET);

  // const [renderPhim, setRenderPhim] = useState([])
  // const [phim, setPhim] = useState('')
  // const [rap, setRap] = useState('')
  // const [renderRap, setRenderRap] = useState([])
  // const [ngay, setNgay] = useState('')
  // const [renderNgay, setRenderNgay] = useState([])
  // const [suat, setSuat] = useState('')
  // const [renderSuat, setRenderSuat] = useState([])
  // const [scheduleId, setScheduleId] = useState('')

  // const dispatch = useDispatch()


  // // useEffect(() =>{
  // //   dispatch(getThongTinLichChieuPhim(phim.id))
  // // },[])

  // const handleSelectPhim = (phim)=>{
  //   if (!phim) {
  //     return undefined;
  //   }

  //   setRenderPhim((data) =>({
  //     ...data,
  //     setPhim: phim,
  //     }))
  //     theatersApi
  //     .getThongTinLichChieuPhim(phim.id)
  //     .then((result) => {
  //       console.log(result?.data);
  //       setRenderPhim((data) => ({ ...data}));
  //     })

  // }

  // const options = [
  //   { value: 'chocolate', label: 'Chocolate' },
  //   { value: 'strawberry', label: 'Strawberry' },
  //   { value: 'vanilla', label: 'Vanilla' }
  // ]
  const [data, setData] = useState([]);
  const [branch, setBranch] = useState([]);
  const [getCounty, setCounty] = useState([]);
  const [movie, setMovie] = useState('');
  useEffect(() => {
    
    moviesApi.getDanhSachPhim()
      .then((response) => {
        console.log(response);
        setData(response?.data);
      })
      .catch((err) => {
        console.log(err);
      });

    theatersApi.getThongTinLichChieuHeThongRap()
    .then((response) => {
      console.log("all branch: ",response);
      setBranch(response?.data?.content);
    })
    .catch((err) => {
      console.log(err);
    });

  }, []);

  const country = [...new Set(data.map((item) => item))];

  const handlerChooseMovie = (event, value) =>{
    console.log("------");
    console.log(event.target.value);
    console.log(value);
    setMovie()
  };

  const handlerRenderDate = (contr) => {

  };

  return (
    <div>
        {/* <Select options={renderPhim} onClick={handleSelectPhim}/> */}
        <Container>
      <Typography>Book your movie!</Typography>
      <Autocomplete
        id="country"
        getOptionLabel={(country) => `${country.name}`}
        options={country}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        noOptionsText={"You must choose movie!"}  
        renderOption={(props, country) => (
          <Box component="li" {...props} key={country.id} value={country.id}
          // onChange={(event, key) => handlerChooseMovie(event, key)}
          >
            {country.name}
          </Box>
        )}
        renderInput={(params) => <TextField {...params} label="Search" />}
      />
      <Autocomplete
        id="city"
        getOptionLabel={(branch) => `${branch.name}`}
        options={branch}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        noOptionsText={"You must choose branch theater!"}
        renderOption={(props, branch) => (
          <Box component="li" {...props} key={branch.id} value={branch}>
            {branch.name}
          </Box>
        )}
        renderInput={(params) => <TextField {...params} label="Branch theater" />}
        onChange={handlerRenderDate}
      />
      <Autocomplete
        id=""
        getOptionLabel={(branch) => `${branch.name}`}
        options={branch}
        // isOptionEqualToValue={(option, value) => option.name === value.name}
        noOptionsText={"You must choose branch theater!"}
        renderOption={(props, branch) => (
          <Box component="li" {...props} key={branch.id} value={branch}>
            {branch.name}
          </Box>
        )}
        renderInput={(params) => <TextField {...params} label="Date" />}
      />
            <Autocomplete
        id=""
        getOptionLabel={(branch) => `${branch.name}`}
        options={branch}
        // isOptionEqualToValue={(option, value) => option.name === value.name}
        noOptionsText={"You must choose branch theater!"}
        renderOption={(props, branch) => (
          <Box component="li" {...props} key={branch.id} value={branch}>
            {branch.name}
          </Box>
        )}
        renderInput={(params) => <TextField {...params} label="Time Show" />}
      />
    </Container>
    </div>
  );
}

Booking.propTypes = {
  smDown: PropTypes.bool,
};
