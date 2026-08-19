import { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import moviesApi from "../../../api/moviesApi";
import "./styles.css";
// var data = require("./MOCK_DATA.json");

export default function Search() {

    const movieList = useSelector((state) => state.movieReducer.movieList);
    // console.log("Search movie: ", movieList);
    const [value, setValue] = useState("");
    const history = useHistory()
    const onChange = (event) => {
        setValue(event.target.value);
        // moviesApi.getSearchPhim(event.target.value)
        // .then((res) => {
        //     console.log(res?.data?.data?.name);
        // })
        // .catch((err) => {
        //     console.log(err);
        // })
    };
    
    const onSearch = (searchTerm) => {
      setValue(searchTerm.toString());
      // our api to fetch the search result
      history.push(`/phim/${searchTerm.toString()}`)
      setValue("");
      console.log("search ", searchTerm);
    };
    
    const onSearchBatKy = (searchTerm) => {
    //   setValue(searchTerm);
        // our api to fetch the search result 
        //diều hướng sang trang tất cả
        history.push(`/search/${searchTerm.toString()}`)
        setValue(null);
        console.log("search ", searchTerm);

    };

    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        onSearchBatKy(value)
      }
    };

    return(
        <div className="search-container">
        <div className="search-inner">

          <input type="text" 
            value={value ? value : ""} 
            onChange={onChange} 
            placeholder="Tìm phim..." 
            onKeyDown={handleKeyDown} />

          <button style={{backgroundColor:"#fb4226", color:"white", padding:"5px", borderRadius:"5px", border:"none"}} 
          onClick={() => onSearchBatKy(value)}> Tìm kiếm </button>
        </div>
        <div className="dropdown">
          {value ? (movieList?.data?.filter((item) => {
              const searchTerm = value.toLowerCase();
              const fullName = item?.name?.toLowerCase();

              return (
                searchTerm &&
                fullName.startsWith(searchTerm) &&
                fullName !== searchTerm
              );
            })
            .slice(0, 10)
            .map((item) => (
              <div
                onClick={() => onSearch(item?.id)}
                className="dropdown-row"
                key={item?.name}
                style={{backgroundColor:"black"}}   
              >
                <div style={{display:"flex", backgroundColor:"black"}}>
                <img style={{display:"flex", width:"40px", height:"50px"}} 
                src={item?.smallImageURl} alt="anh"/>
                <span style={{padding:"1rem"}}>{item?.name}</span>
                </div>
              </div>
            ))):null
        }
        </div>
      </div>
    )
}