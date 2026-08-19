import React from 'react'

import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Tooltip from '@material-ui/core/Tooltip';

import UseApiCheckIsMaPhimSetShowtime from '../../utilities/useApiCheckIsMaPhimSetShowtime';

export default function ButtonDelete({ onXemQua, onDeleted, phimItem, onEdit, onTuChoi }) {
  const isMovieSetShowtime = UseApiCheckIsMaPhimSetShowtime(phimItem.id)
  return (
    <>
      {/* <Tooltip title={isMovieSetShowtime ? "Can't Delete" : "Delete"}>
        <IconButton color="primary" style={{ color: isMovieSetShowtime ? "#00000042" : "#f50057" }} onClick={() => onDeleted(phimItem.id)} >
          <DeleteForeverIcon />
        </IconButton>
      </Tooltip> */}

      <Tooltip title="Xem qua">
        {/* <IconButton color="primary" style={{ color: "#b24332" }} onClick={() => onEdit(phimItem)} > */}
            <button
              onClick={() => onXemQua(phimItem)}
              type="button"
              className="btn btn-primary"
              style={{
                margin:"0.1rem",
                fontSize:"12px"
              }}
            >
              Xem qua
            </button>
        {/* </IconButton> */}
      </Tooltip>

      <Tooltip title={isMovieSetShowtime ? "Từ chối" : "Không từ chối được"}>
        {/* <IconButton color="primary" style={{ color: isMovieSetShowtime ? "#f50057" : "#00000042" }} onClick={() => onDeleted(phimItem.id)} > */}
        <button
              onClick={() => onTuChoi(phimItem)}
              type="button"
              className="btn btn-danger"
              style={{
                // padding:"0.1rem"
                margin:"0.1rem",
                fontSize:"12px"

              }}
            >
              Từ chối
        </button>
        {/* </IconButton> */}
      </Tooltip>

      <Tooltip title="Duyệt">
        {/* <IconButton color="primary" style={{ color: "#b24332" }} onClick={() => onEdit(phimItem)} > */}
        <button
              onClick={() => onEdit(phimItem)}
              type="button"
              className="btn btn-success"
              style={{
                // padding:"0.1rem" 
                margin:"0.1rem",
                fontSize:"12px"


              }}
            >
              Duyệt
        </button>
        {/* </IconButton> */}
      </Tooltip>

      <Tooltip title={isMovieSetShowtime ? "Xoá" : "Không xoá được"}>
        {/* <IconButton color="primary" style={{ color: isMovieSetShowtime ? "#f50057" : "#00000042" }} onClick={() => onDeleted(phimItem.id)} > */}
        <button
              onClick={() => onDeleted(phimItem)}
              type="button"
              className="btn btn-secondary"
              style={{
                // padding:"0.1rem"
                margin:"0.1rem",
                fontSize:"12px"

              }}
            >
              Xoá
        </button>
        {/* </IconButton> */}
      </Tooltip>

    </>

  )
}
