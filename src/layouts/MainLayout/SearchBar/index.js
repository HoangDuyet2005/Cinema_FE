import { useState } from "react";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import "./style.css"

export default function SearchBar() {
    const [value, setValue] = useState("");
    const history = useHistory()
    const onChange = (event) => {
        setValue(event.target.value);
    };
    
    const onSearchBatKy = (searchTerm) => {
        if(value)
        {
            history.push(`/search/${searchTerm.toString()}`)
            setValue(null);
        }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        onSearchBatKy(value)
      }
    };

    const hanleSearch = () => {
        if(value)
        {
            history.push(`/search/${value.toString()}`)
            setValue(null);
        }
        else Swal.fire('Vui lòng gõ nội dung tìm kiếm!', '', 'info')
    }

return(
    <div className="topnav">
        <div class="search-container">
            <input 
                type="text" 
                placeholder="Tìm kiếm.." 
                name="search"
                onKeyDown={handleKeyDown}
                // value={value ? value : ""} 
                value={value} // Thay đổi ở đây
                onChange={onChange} 
            />
            <button type="button" onClick={hanleSearch}>
                <i class="fa fa-search"></i>
            </button>
        </div>
    </div>
    )
}