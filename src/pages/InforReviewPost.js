
import { Button, CardActions, IconButton, Typography } from '@material-ui/core';
import { Comment as CommentIcon, Share as ShareIcon, Favorite as FavoriteIcon , Visibility as VisibilityIcon} from '@material-ui/icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postCommentBaiViet, postLikeUnlikeBaiViet } from '../reducers/actions/Interaction';
import interactionApi from "../api/interactionApi"
import { getInfoUser } from '../reducers/actions/UsersManagement';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import useStyles from './SeeCommentPost/style';
import Box from "@material-ui/core/Box";
import { scroller } from "react-scroll";
import Swal from 'sweetalert2';
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { FAKE_AVATAR } from '../constants/config';
import CircularProgress from "@material-ui/core/CircularProgress";
import moment from "moment";
import "moment/locale/vi";
import DeleteOrEdit from "./DeleteOrEdit"
moment.locale("vi");

function TabPanel(props) {
  const { isMobile, children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      <Box p={isMobile && index === 0 ? 0 : 3}>{children}</Box>
    </div>
  );
}

export default function InforReviewHomepage({ idReviewPost,   
  data,
  onClickBtnMuave,
  isMobile,
  onIncreaseQuantityComment,
  uniqueKey,
  soView
  }) {

  const [commentList, setCommentList] = useState()
  const [likeList, setListLike] = useState()
  const [likeCheck, setLikeCheck] = useState(false)
  const { successInfoUser, loadingInfoUser } = useSelector(
    (state) => state.usersManagementReducer
  );
  const { currentUser } = useSelector((state) => state.authReducer);
  const [soLike, setSoLike] = useState(0);
  const [soCmt, setSoCmt] = useState(0);
  // const [isLiked, setIsLiked] = useState(false);
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getInfoUser)
  },[currentUser])
  
  useEffect(()=>{
    interactionApi.getAllLikeBaiViet(idReviewPost)
    .then(result => {
    //  console.log("data danh sách like bài viết: ", result.data.data);
     setListLike(result.data.data)
    })
    .catch(
      // console.log("lỗi")
    )
  },[soLike])

  useEffect(()=>{
    interactionApi.getAllCommentBaiViet(idReviewPost)
        .then(result => {
        //  console.log("data danh sách comment bài viết nè: ", result.data.data);
         setCommentList(result.data.data)
        })
        .catch(
          // console.log("lỗi")
    )
  },[soCmt])

  useEffect(() => {
    interactionApi.checkUserLikeOrUnlike(currentUser?.data?.id, idReviewPost)
      .then(result => {
      //  console.log("Like check: ", result.data);
       setLikeCheck(result.data.success)
      })
      .catch(
        // console.log("lỗi")
      )
  }, [idReviewPost]);


  // console.log(likeCheck);
  // console.log(likeList);
  // console.log(currentUser);

  const handleLikeClick = () => {
    if (currentUser === null) {
      isLogin();
      return;
    }
    if (likeCheck === true) {
      // console.log("Unlike");
      dispatch(postLikeUnlikeBaiViet({ userId: successInfoUser?.data?.id, articleId: idReviewPost }));
      // dispatch(getListLikeBaiViet(idReviewPost));
      interactionApi.getAllLikeBaiViet(idReviewPost)
        .then(result => {
        // console.log("data danh sách like bài viết: ", result.data.data);
        setSoLike(result.data.data.length - 1);
        setListLike(result.data.data)
        setLikeCheck(false);
        })
        .catch(
          // console.log("lỗi")
        )

    } else {
      // console.log("Like");
      dispatch(postLikeUnlikeBaiViet({ userId: successInfoUser?.data?.id, articleId: idReviewPost }));
      // dispatch(getListLikeBaiViet(idReviewPost));
      interactionApi.getAllLikeBaiViet(idReviewPost)
        .then(result => {
        // console.log("data danh sách like bài viết: ", result.data.data);
        setSoLike(result.data.data.length + 1);
        setListLike(result.data.data)
        setLikeCheck(true);
        })
        .catch(
          // console.log("lỗi")
        )
    }
  };

    const [open, setOpen] = useState(false);
    const handleCloseDialog = () => {
      setOpen(false);
    };
    const {
      loadingCommentPost,
      commentPost,
    } = useSelector((state) => state.interactionReducer);

    let location = useLocation();
    const history = useHistory();
    const [openComment, setOpenComment] = useState(false);
    const [warningtext, setwarningtext] = useState(false);
    const [commentListDisplay, setCommentListDisplay] = useState({
      comment: [],
      page: 5,
      hideBtn: false,
      idScrollTo: "",
    });
    const [dataComment, setdataComment] = useState({
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
    const classes = useStyles({ hideBtn: commentListDisplay.hideBtn, isMobile });


  useEffect(() => {
    // khi commentList lấy về thành công thì cập nhật số người bình luận
    if (commentList?.length && !isMobile) {
      onIncreaseQuantityComment(commentList?.length);
    }
  }, [commentList]);

  useEffect(() => {
    interactionApi.getAllCommentBaiViet(idReviewPost)
      .then(result => {
      // console.log("data danh sách comment bài viết nè: ", result.data.data);
      setCommentList(result.data.data)
      })
      .catch(
        // console.log("lỗi")
      )
    if (commentPost) {
      // reset text comment
      setdataComment((data) => ({ ...data, description: "" }));
    }
  }, [commentPost]);

  // console.log(commentListDisplay);
  useEffect(() => {
    // const comment = commentList?.slice(0, commentListDisplay.page);
    // const comment = commentList?.content?.slice(0,commentListDisplay?.page);
    const comment = commentList?.content?.slice(0, commentList?.totalElements);
    setCommentListDisplay((data) => ({ ...data, comment }));
  }, [commentList]);

  useEffect(() => {
    if (commentListDisplay.idScrollTo) {
      scroller.scrollTo(commentListDisplay.idScrollTo, {
        duration: 800,
        offset: -79,
        smooth: "easeInOutQuart",
      });
    }
  }, [commentListDisplay.idScrollTo]);

  const handlePostComment = () => {
    if (loadingCommentPost) {
      return;
    }
    if (dataComment.description.length < 1) {
      // nếu comment quá ngắn
      setwarningtext(true);
      return;
    }
    setwarningtext(false);
    const currentISOString = new Date().toISOString();
    setOpenComment(false);
    // console.log("đăng cmt:", dataComment);
    dispatch(postCommentBaiViet(
      {
        description: dataComment?.description, 
        articleId: idReviewPost, 
        userId: successInfoUser?.data?.id
      }
    ))
  };
  
  const setopenMore = () => {
    let hideBtn = false;
    let addComment = commentList?.totalElements % 5;
    if (commentList?.totalElements % 5 === 0) {
      addComment = 5;
    }
    if (commentListDisplay.page + addComment === commentList?.totalElements) {
      hideBtn = true;
    }
    const idScrollTo = `idComment${
      commentList?.content[commentListDisplay?.page]?.createdAt
    }`;
    const page = commentListDisplay?.page + 5;
    const comment = commentList?.content?.slice(0, page);
    setCommentListDisplay((data) => ({
      ...data,
      comment,
      page,
      hideBtn,
      idScrollTo,
    }));
  };

  // const handleLike = (id) => {
  //   // if (loadingLikeComment) {
  //   //   return;
  //   // }  
  //   if (!currentUser) {
  //     isLogin();
  //     return;
  //   }
  //   // tăng giảm số lượng like và add/remove email đã like
  //   const commentUserLiked = commentList.find((item) => item.id === id);
  //   if (commentUserLiked.userLikeThisComment.includes(currentUser.email)) {
  //     // xóa user khỏi danh sách liked comment, trừ số lượng like
  //     commentUserLiked.userLikeThisComment =
  //       commentUserLiked.userLikeThisComment.filter((item) => {
  //         return item !== currentUser.email;
  //       });
  //     commentUserLiked.likes = commentUserLiked.likes - 1;
  //   } else {
  //     commentUserLiked.userLikeThisComment.push(currentUser.email);
  //     commentUserLiked.likes = commentUserLiked.likes + 1;
  //   }
  //   // dispatch(likeComment(id, commentUserLiked));
  // };

  const handletyping = (event) => {
    if (event.target.value.length >= 11) {
      // nếu comment quá ngắn
      setwarningtext(false);
    }
    setdataComment((data) => ({ ...data, description: event.target.value }));
  };

  const handleClose = () => {
    setOpenComment(false);
  };

  const isLogin = () => {
    if (!currentUser) {
      // nếu chưa đăng nhập
      Swal.fire({
        title: "Bạn cần phải đăng nhập!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Đăng nhập",
        cancelButtonText: "Không",
      }).then((result) => {
        if (result.isConfirmed) {
          history.push("/dangnhap", location.pathname);
        }
      });
    }
  };

  const handleClickComment = () => {
    if (!currentUser) {
      handleCloseDialog();
      isLogin();
      return;
    }
    setOpenComment(true);
    setwarningtext(false);
  };

  useEffect(() => {
    if (likeList && commentList) {
      setSoLike(likeList.length);
      setSoCmt(commentList.totalElements);
    }
  }, [likeList, commentList, soLike, soCmt]);


  return (
    <CardActions disableSpacing >
      <IconButton aria-label="add to favorites" style={{ color: likeCheck === true ? "red" : "grey" }} onClick={handleLikeClick}>
        <FavoriteIcon />
        <Typography>{soLike}</Typography>
      </IconButton>
      <div >
        <IconButton aria-label="comment" style={{ color: "grey" }} 
              // onClick={() => {
              //   setIsPaneOpen(true);
              // }}>
              onClick={() => {
                setOpen(true);
              }}
              // onClick={handleClickOpen}
              >
          <CommentIcon />
          <Typography>{soCmt}</Typography>
        </IconButton>
      </div>
      <IconButton aria-label="Xem (icon hình con mắt)" style={{ color: "grey" }}>
        <VisibilityIcon />
        <Typography>{soView}</Typography>
      </IconButton>
        {/* <Comment
        isPaneOpen={isPaneOpen}
        onClose={() => {
          setIsPaneOpen(false);
        }}
        idReviewPost={idReviewPost}
        /> */}
      {/* <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="right"
          open={open}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <SidebarComment handleDrawerClose={handleDrawerClose} />
      </Drawer> */}

    <div>
      {/* <Button variant="outlined">
        Open responsive dialog
      </Button> */}
      <Dialog
        // fullScreen={fullScreen}

        fullWidth
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="responsive-dialog-title"
      >
         <MuiDialogTitle disableTypography className={classes.rootcloseButton}>
          <DialogTitle id="responsive-dialog-title">
            {"Để lại bình luận của bạn"}
          </DialogTitle>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleCloseDialog}
          >
            <CloseIcon />
          </IconButton>
        </MuiDialogTitle>
        {/* <DialogActions> */}
        <div className={classes.theLon}>
          <div className={classes.danhGia}>
              <div className={classes.inputRoot} onClick={handleClickComment}>
                <span className={classes.avatarReviewer}>
                  <img
                    src={successInfoUser?.data?.image ? successInfoUser?.data?.image : FAKE_AVATAR}
                    alt="avatar"
                    className={classes.avatarImg}
                  />
                </span>
                <input
                  className={classes.inputReviwer}
                  type="text"
                  placeholder="Để lại bình luận cho bài viết?"
                  readOnly="readonly"
                />
                {/* <span className={classes.imgReviewerStar}>
                  <Rating
                    value={5}
                    size={isMobile ? "small" : "medium"}
                    readOnly
                  />
                </span> */}
              </div>
            </div>
            <div
              className="text-center mb-2 text-white"
              hidden={!loadingCommentPost}
            >
              <CircularProgress size={20} color="inherit" />
            </div>
            {commentListDisplay?.comment?.map((item, index) => (
              <div
                // key={`${item.id}`}
                key={index}
                className={classes.itemDis}
                id={`idComment${item.id}`}
              >
                <div className={classes.infoUser}>
                  <div className={classes.left}>
                    <span className={classes.avatar}>
                      <img
                        // src={item?.image}
                        src={item?.image ?item?.image: FAKE_AVATAR}
                        alt="avatar"
                        className={classes.avatarImg}
                      />
                    </span>

                    <span className={classes.liveUser}>
                      <p className={classes.userName}>{item.name}</p>
                      <p className={classes.timePost}>
                        {moment(item.createdAt).fromNow()}
                      </p>

                    </span>

                  </div>
                  {/* <div className={classes.right}>
                    <p className="text-success">{item.point}</p>
                    <Rating
                      value={(item.point * 5) / 10}
                      precision={0.5}
                      size={isMobile ? "small" : "medium"}
                      readOnly
                    />
                  </div> */}
                  {(
                    currentUser && successInfoUser?.data?.id == item?.userId ?                   
                      <span className={classes.nutTuyChon}>
                        <DeleteOrEdit id={item.id} setCommentList={setCommentList} idReviewPost={idReviewPost} description={item?.description}
                        onIncreaseQuantityComment={onIncreaseQuantityComment} setdataComment={setdataComment} dataComment={item?.description}
                        />
                      </span> : null
                      
                  )}

                  <div className="clearfix"></div>
                </div>
                <div className="py-3 mb-3 border-bottom">
                  <p className="text-break">{item.description}</p>
                </div>


                {/* <span
                  className="d-inline-block"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleLike(item.id)}
                >
                  <span className="mr-2">
                    {((userLikeThisComment) => {
                      return (
                        <ThumbUpIcon
                          style={{
                            color: userLikeThisComment?.includes(
                              currentUser?.email
                            )
                              ? "#fb4226"
                              : "#73757673",
                          }}
                        />
                      );
                    })(item.userLikeThisComment)}
                  </span>
                  <span style={{ color: "#737576" }}>
                    <span>{item.likes}</span> Thích
                  </span>
                </span> */}
              </div>
            ))}
            <div className={classes.moreMovie}>
              <Button
                variant="outlined"
                onClick={() => setopenMore()}
                className="btn-xem-them-global"
              >
                Xem thêm
              </Button>
            </div>
          </div>
      </Dialog>

      <Dialog
        open={openComment}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        className={classes.dialog}
      >
        <MuiDialogTitle disableTypography className={classes.rootcloseButton}>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </MuiDialogTitle>
        <Grid container direction="column" justify="center" alignItems="center">
          <span style={{fontSize: "20px", marginTop:"1rem"}}>Để lại bình luận</span>
        </Grid>
        <DialogContent className={classes.dialogContent}>
          <TextField
            className={classes.textField}
            onChange={(event) => handletyping(event)}
            fullWidth
            value={dataComment.description}
            variant="outlined"
            label={
              dataComment.description
                ? ""
                : "Nói lên suy nghĩ của bạn..."
            }
          />
        </DialogContent>
        <DialogActions className="justify-content-center flex-column px-4">
          {warningtext && (
            <DialogContentText className="text-danger">
              Vui lòng gõ ký tự!
            </DialogContentText>
          )}
          <Button
            onClick={handlePostComment}
            variant="contained"
            className={classes.btnDang}
          >
            Đăng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    
    </CardActions>

  );
}
