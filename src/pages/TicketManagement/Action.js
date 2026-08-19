import React from 'react'

import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Tooltip from '@material-ui/core/Tooltip';

import UseApiCheckIsMaPhimSetShowtime from '../../utilities/useApiCheckIsMaPhimSetShowtime';

export default function ButtonDelete({ onDeleted, phimItem, onEdit }) {
  const isMovieSetShowtime = UseApiCheckIsMaPhimSetShowtime(phimItem.id)
  return (
    <>
      {/* <Tooltip title={isMovieSetShowtime ? "Can't Delete" : "Delete"}>
        <IconButton color="primary" style={{ color: isMovieSetShowtime ? "#00000042" : "#f50057" }} onClick={() => onDeleted(phimItem.id)} >
          <DeleteForeverIcon />
        </IconButton>
      </Tooltip> */}
      <Tooltip title={isMovieSetShowtime ? "Can Delete" : "Can't Delete"}>
        <IconButton color="primary" style={{ color: isMovieSetShowtime ? "#f50057" : "#00000042" }} onClick={() => onDeleted(phimItem.id)} >
          <DeleteForeverIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Edit">
        <IconButton color="primary" style={{ color: "#b24332" }} onClick={() => onEdit(phimItem)} >
          <EditIcon />
        </IconButton>
      </Tooltip>
    </>

  )
}
