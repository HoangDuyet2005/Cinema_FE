import React from 'react'

import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Tooltip from '@material-ui/core/Tooltip';

import UseApiCheckIsMaPhimSetShowtime from '../../utilities/useApiCheckIsMaPhimSetShowtime';

export default function ButtonDelete({ onDeleted, phimItem, onEdit, onTuChoi }) {
  const isMovieSetShowtime = UseApiCheckIsMaPhimSetShowtime(phimItem.id)
  return (
    <>

      <Tooltip title="Thanh toán">
        {/* <IconButton color="primary" style={{ color: "#b24332" }} onClick={() => onEdit(phimItem)} > */}
        <button
              onClick={() => onEdit(phimItem)}
              type="button"
              className="btn btn-success"
              style={{
                // padding:"0.1rem" 
                margin:"0.3rem"

              }}
            >
              Thanh toán
        </button>
        {/* </IconButton> */}
      </Tooltip>

    
    </>

  )
}
