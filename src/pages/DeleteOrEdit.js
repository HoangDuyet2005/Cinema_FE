import * as React from 'react';
// import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { getListCommentBaiViet, putDeleteComment } from '../reducers/actions/Interaction';
import interactionApi from '../api/interactionApi';
import { Dialog, TextField } from '@material-ui/core';
import DialogActions from '@mui/material/DialogActions';
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import useStyles from './SeeCommentPost/style';
import Grid from "@material-ui/core/Grid";
import { GridCloseIcon } from '@material-ui/data-grid';
import DialogContent from '@mui/material/DialogContent';
import { Button, CardActions, Typography } from '@material-ui/core';
import DialogContentText from '@mui/material/DialogContentText';


const ITEM_HEIGHT = 48;

export default function DeleteOrEdit(data) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [warningtext, setwarningtext] = React.useState(false);
  const [dataEdit, setDataEdit] = React.useState({description: ""});
  const [dataCu, setDataCu] = React.useState("");
  const [openCommentEdit, setOpenCommentEdit] = React.useState(false);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.authReducer);
  const {commentList} = useSelector((state) => state.interactionReducer);
  const classes = useStyles({ hideBtn: data?.commentListDisplay?.hideBtn });


  React.useEffect(() => {
    // khi commentList lấy về thành công thì cập nhật số người bình luận
    if (commentList?.length) {
      data.onIncreaseQuantityComment(commentList?.length);
    }
  }, [commentList]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseEdit = () => {
    setOpenCommentEdit(false);
  };

  React.useEffect(() => {
    dispatch(getListCommentBaiViet(data.idReviewPost))
  },[data.idReviewPost])

  const [dataComment, setdataComment] = React.useState({
    avtId: currentUser?.username,
    username: currentUser?.name,
    // point: 2.5,
    description: "",
    // likes: 0,
    // maPhim: param.maPhim,
    dataTest: false,
    createdAt: "",
    // userLikeThisComment: [],
  });

// console.log(data.setCommentListDisplay);
  const handleDelete = () => {
    // console.log(data.id);
    interactionApi.putDeleteComment(data.id)
      .then(result => {
          // console.log("Delete comment: ", result.data);

          interactionApi.getAllCommentBaiViet(data.idReviewPost)
          .then(result => {
            data.setCommentList(result.data)
            // console.log(result.data);
          })
          .catch(
            // console.log("lỗi")
          )
      })
      .catch(
            // console.log("lỗi xóa")
      )
    // dispatch(putDeleteComment(id));
    // dispatch(getListCommentBaiViet(data.idReviewPost))
    // data.setCommentListDisplay(commentList.content)
    handleClose();
    setAnchorEl(null);
  };

  const handleClickCommentEdit = () => {
    handleClose();
    setOpenCommentEdit(true);
    setwarningtext(false);
  };

  const handletyping = (event) => {
    // if (event.target.value.length >= 11) {
    //   // nếu comment quá ngắn
    //   setwarningtext(false);
    // }
    setDataEdit((data) => ({ ...data, description: event.target.value }));
  };

  const handleEdit = () => {
    if (dataEdit.description.length < 1) {
      // nếu comment quá ngắn
      setwarningtext(true);
      return;
    }
    // console.log(dataEdit);
    const dulieu = {
      id: data.id,
      description: dataEdit.description
    }
    interactionApi.putEditComment(dulieu)
      .then(result => {
          // console.log("Delete comment: ", result.data);

          interactionApi.getAllCommentBaiViet(data.idReviewPost)
          .then(result => {
            data.setCommentList(result.data)
            // console.log(result.data);
          })
          .catch(
            // console.log("lỗi")
          )
      })
      .catch(
            // console.log("lỗi sửa")
      )
    // dispatch(putDeleteComment(id));
    // dispatch(getListCommentBaiViet(data.idReviewPost))
    // data.setCommentListDisplay(commentList.content)
    handleClose();
    setAnchorEl(null);
  };

  // console.log(data.dataComment);

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        <MenuItem 
          onClick={handleClickCommentEdit}
        >
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          Xóa
        </MenuItem>
      </Menu>

      <div>


      <Dialog
        open={openCommentEdit}
        onClose={handleCloseEdit}
        maxWidth="sm"
        fullWidth
        className={classes.dialog}
      >
        <MuiDialogTitle disableTypography className={classes.rootcloseButton}>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleCloseEdit}
          >
            <GridCloseIcon />
          </IconButton>
        </MuiDialogTitle>
        <Grid container direction="column" justify="center" alignItems="center">
          <span style={{fontSize: "20px", marginTop:"1rem"}}>Chỉnh sử bình luận</span>
        </Grid>
        <DialogContent className={classes.dialogContent}>
          <TextField
            className={classes.textField}
            onChange={(event) => handletyping(event)}
            fullWidth
            defaultValue={data?.dataComment}
            variant="outlined"
            // label={
            //   data?.description
            // }
          />
        </DialogContent>

        <DialogActions className="justify-content-center flex-column px-4">
          {warningtext && (
            <DialogContentText className="text-danger">
              Vui lòng gõ ký tự!
            </DialogContentText>
          )}
          <Button
            onClick={handleEdit}
            variant="contained"
            className={classes.btnDang}
          >
            Đăng
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    </div>
  );
}