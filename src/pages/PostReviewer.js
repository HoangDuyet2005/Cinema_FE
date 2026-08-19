import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Avatar, Button, Card, CardActions, CardContent, CardHeader, IconButton, Typography } from '@material-ui/core';
import { Comment as CommentIcon, Share as ShareIcon, Favorite as FavoriteIcon } from '@material-ui/icons';
import SpinnerLoading from '../components/SpinnerLoading/SpinnerLoading';
import formatDate from '../utilities/formatDate';
import SeeDetail from './SeeDetail';
import { FAKE_AVATAR } from '../constants/config';
import InforReviewPost from './InforReviewPost';
import JoditEditor from 'jodit-react';

import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { CardBody, Form, Input, Label, Container } from "reactstrap";
import {Card as Card1, Button as Button1 } from "reactstrap";
import Swal from 'sweetalert2';
import CircularIntegration from '../utilities/CircularIntegration';
import reviewsApi from '../api/reviewsApi';
import { useDispatch, useSelector } from 'react-redux';
import { getInfoUser } from '../reducers/actions/UsersManagement';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    margin: 'auto',
    marginBottom: theme.spacing(2),
  },
  media: {
    height: "100%",
    width: "100%",
  },
  expand: {
    marginLeft: 'auto',
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PostReviewer({reviewerDetailShowtimes, reviewList, avatar }) {
  const classes = useStyles();

  const { successInfoUser, loadingInfoUser } = useSelector(
    (state) => state.usersManagementReducer
  );

  const dispatch = useDispatch();
  let [danhSachTinTuc, setDanhSachTinTuc] = useState();
  let [loading, setLoading] = useState(true);
  const [imageHien, setImageHien] = useState('')
  const [selectedPost, setSelectedPost] = useState(null);

  // console.log("successInfoUser: ", successInfoUser);
  // console.log("reviewerDetailShowtimes: ", reviewerDetailShowtimes);

  useEffect(()=>{
    dispatch(getInfoUser)
  },[])

  useEffect(() => {
      setDanhSachTinTuc(reviewList);
      setLoading(false);
  }, [reviewList]);
  // console.log("danhSachTinTuc: ", danhSachTinTuc);

  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState('paper');

  const editor = useRef(null)
  const [image, setImage] = useState(null)
  const [post, setPost] = useState({
    mainImage:'',
    title: '',
    brief:'',
    description:'',
    keyword: ''
  })

  // console.log(avatar);
  const handleClickOpen = (tinTuc) => {
    setSelectedPost(tinTuc);
    setOpen(true);
  };

  const handleClose = () => {
      setOpen(false);
  };

  const [openViet, setOpenViet] = useState(false);

  const handleClickOpenViet = () => {
    setOpenViet(true);
  };

  const handleCloseViet = () => {
    setOpenViet(false);
  };

  const fieldChanged = (event) => {
    // console.log(event)
    setPost({ ...post, [event.target.name]: event.target.value })
  }

  const contentFieldChanaged = (data) => {
    setPost({ ...post, 'description': data })
  }

  const submitImage =() =>{
    const data  = new FormData()
    data.append("file", imageHien)
    data.append("upload_preset", "hh37brtc")
    data.append("cloud_name", "dfb5p3kus")

    fetch("https://api.cloudinary.com/v1_1/dfb5p3kus/image/upload", {
      method: "post",
      body:data
    })
    .then((res) => res.json())
    .then((data) =>{
      // console.log(data.secure_url);
      setImageHien(data.secure_url)
      setPost({ ...post, 'mainImage': data.secure_url })
    })
    .catch((err) => {
      // console.log(err);
    })
  }

  const createPost = (e) =>{
    // console.log(post);
    handleCloseViet();
    reviewsApi.postAddReview(post)
    .then((res) =>{
      // console.log("Thành công!", res);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Đăng review thành công, vui lòng chờ duyệt!",
        showConfirmButton: false,
        timer: 4000,
      });
    })
    .catch((err) =>{
      // console.log(err);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Đăng review thất bại, kiểm tra lại!",
        showConfirmButton: false,
        timer: 4000,
      });
    })
  }


  const renderTinTuc = () => {
    return danhSachTinTuc?.map((tinTuc, index) => {
      if(tinTuc?.type === "REVIEWS" && tinTuc?.status === "APPROVE") {
      return (
        <div key={tinTuc.id}>
        <Card className={classes.root} key={tinTuc.id}>
            <CardHeader
                avatar={
                <Avatar aria-label="recipe" className={classes.avatar}>
                  <img style={{width: "40px", height:"40px"}} src={avatar ? avatar : FAKE_AVATAR} alt="Avatar"/>
                </Avatar>
            }
                title={tinTuc?.title} //Đề mục tên bài review
                subheader={formatDate(tinTuc?.createdAt).dateFull} // ngày đăng
            />
            <img className={classes.media} src={tinTuc?.mainImage} alt="postimage" />

        <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
                {tinTuc?.brief}
            </Typography>

        <div onClick={() => handleClickOpen(tinTuc)} style={{ cursor: "pointer", ":hover": { cursor: "pointer" } , color:"rgb(251, 66, 38)"}}>
          <span>Xem thêm...</span>
        </div>

        </CardContent>

          <SeeDetail
            open={open}
            handleClose={handleClose}
            scroll={scroll}
            title={selectedPost?.title}
            description={selectedPost?.description}
          />

          <InforReviewPost idReviewPost={tinTuc?.id} soView={tinTuc?.view}/>
          
      </Card>
      </div>
      );
    }
    });
  };

  if (loading) {
    return <SpinnerLoading />;
  } else {
    return (
      <div>
        <div className="news__header">
          <div className="overlay">
            <div className="title__description">
                CÁC BÀI REVIEW CỦA {reviewerDetailShowtimes?.name}
            </div>
          </div>
        </div>
        <div className="news__container container">
          <div className="news__content row">
            {successInfoUser && successInfoUser?.data?.id ===  reviewerDetailShowtimes?.id?
              <div className="news__left col-md-12 col-sm-12" 
              // onClick={() => handleClickOpen()}
              style={{ cursor: "pointer", ":hover": { cursor: "pointer" } , color:"rgb(251, 66, 38)"}}>
              <Card className={classes.root} 
              onClick={() => handleClickOpenViet()}
              
              >
                <CardHeader
                    avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                      <img style={{width: "40px", height:"40px"}} src={reviewerDetailShowtimes?.image ? reviewerDetailShowtimes?.image : FAKE_AVATAR} alt="Avatar"/>
                    </Avatar>
                }
                    title={reviewerDetailShowtimes?.name} 
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Viết bài viết mới của bạn...
                    </Typography>
                </CardContent>
              </Card>
            </div>: null}
          
          <Dialog
            fullScreen
            open={openViet}
            onClose={handleCloseViet}
            TransitionComponent={Transition}
          >
            <AppBar sx={{ position: 'relative' }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleCloseViet}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                  Trình soạn thảo bài Review
                </Typography>
                {/* <Button autoFocus color="inherit" onClick={handleCloseViet}>
                  save
                </Button> */}
              </Toolbar>
            </AppBar>
            {/* <List>
              <ListItem button>
                <ListItemText primary="Phone ringtone" secondary="Titania" />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemText
                  primary="Default notification ringtone"
                  secondary="Tethys"
                />
              </ListItem>
            </List> */}
            
            <Card1 className="shadow-sm  border-0 mt-2">
                <CardBody>
                    {/* {JSON.stringify(post)} */}
                    {/* <h3>{data?.name}</h3> */}
                    <Form onSubmit={createPost}>
                    {/* Sửa chỗ này lại dder nộp nè */}
                    {/* Sửa chỗ này lại dder nộp nè */}
                    {/* Sửa chỗ này lại dder nộp nè */}
                    {/* Goi API */}
                    {/* <Form > */}
                        <div className="my-3">
                            <Label for="title" >Tiêu đề bài viết</Label>
                            <Input
                                type="text"
                                id="title"
                                placeholder="Gõ vào đây..."
                                className="rounded-0"
                                name="title"
                                onChange={fieldChanged}
                            />
                        </div>
                        <div className="my-3">
                            <Label for="title" >Mô tả ngắn gọn</Label>
                            <Input
                                type="text"
                                id="brief"
                                placeholder="Gõ vào đây..."
                                className="rounded-0"
                                name="brief"
                                onChange={fieldChanged}
                            />
                        </div>
                        <div className="my-3">
                            <Label for="description" >Nội dung Review</Label>
                            {/* <Input
                                type="textarea"
                                id="content"
                                placeholder="Enter here"
                                className="rounded-0"
                                style={{ height: '300px' }}
                            /> */}
                            <JoditEditor
                                ref={editor}
                                value={post.description}
                                onChange={(newContent) => contentFieldChanaged(newContent)}
                            />
                        </div>
                        <div className="my-3">
                            <Label for="title" >Thêm keyword</Label>
                            <Input
                                type="text"
                                id="keyword"
                                placeholder="Nhập keyword"
                                className="rounded-0"
                                name="keyword"
                                onChange={fieldChanged}
                            />
                        </div>
                        <div className="mt-3">
                            <Label for="image">Chọn hình ảnh làm banner cho bài Review</Label>
                            <Input id="image" type="file" 
                              onChange={(e) => {
                                setImageHien(e.target.files[0])
                                // console.log(e.target.files[0]);
                              }} />
                            {/* <button
                              type="button"
                              // type="button"
                              // onClick={() => handleSubmit()}
                              onClick={submitImage}
                              className="btn btn-danger"
                              // disable={loadingUpdateUser.toString()}
                            >
                              Cập nhật ảnh lên
                            </button> */}
                            {
                              imageHien ?                             
                              <div onClick={submitImage}>
                              <CircularIntegration data={"Cập nhật ảnh lên"}/>
                              </div> : null
                            }

                            <img
                              style={
                                {
                                  width:"50%",
                                  height:"50%",
                                }
                              }
                              src={imageHien ? imageHien : null}
                              alt={""}
                            />
                            </div>
                        <Container className="text-center">
                            <Button1 style={{margin:"5px"}} type="button" onClick={createPost}className="rounded-0" color="primary">Gửi Review</Button1>
                            <Button1 style={{margin:"5px"}} className="rounded-0 ms-2" color="danger">Tải lại trang</Button1>
                        </Container>
                    </Form>
                </CardBody>
                {/* <div dangerouslySetInnerHTML={{__html:post.description}} />
                {post.description} */}
            </Card1>

          </Dialog>

            <div className="news__left col-md-12 col-sm-12">
              {renderTinTuc()}
            </div>
            {/* <div className="news__right col-md-4 col-sm-12">
              <h3 className="news__title">Hot</h3>
              {renderTinTucHot()}
            </div> */}
          </div>
        </div>
        </div>
    );
  }
}