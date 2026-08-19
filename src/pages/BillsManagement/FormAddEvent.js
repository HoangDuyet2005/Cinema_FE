import React, { useState } from 'react';
import * as yup from "yup";
import { ErrorMessage, Field, Form, Formik } from 'formik'
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { ThemeProvider } from "@material-ui/styles";
import FormControl from '@material-ui/core/FormControl';
import { materialTheme } from './styles';
import { useStyles } from './styles';

export default function FormAdd({ selectedPhim, onUpdate, onAddMovie }) {
  const classes = useStyles();
  const [srcImage, setSrcImage] = useState(selectedPhim?.contents[0]?.image)
  const [srcImage2, setSrcImage2] = useState(selectedPhim?.largeImageURL)
  const [image, setImage] = useState('')
  const [image2, setImage2] = useState('')

  const setThumbnailPreviews = (e) => {
    let file = e.target;
    var reader = new FileReader();
    reader.readAsDataURL(file.files[0]);
    reader.onload = function () { // sau khi thực hiên xong lênh trên thì set giá trị có được
      setSrcImage(reader.result)
    };
  }

  const movieSchema = yup.object().shape({
    name: yup.string().required("*Not be empty!"),
    smallImageURl: yup.string().required("*Please choose image!"),
    largeImageURL: yup.string().required("*Please choose image!"),
    shortDescription: yup.string().required("*Not be empty!").min(50, "Mô tả cần 100 ký tự trở lên!"),
    longDescription: yup.string().required("*Not be empty!").min(50, "Mô tả cần 100 ký tự trở lên!"),
    director: yup.string().required("*Not be empty!"),
    actors: yup.string().required("*Not be empty!"),
    categories: yup.string().required("*Not be empty!"),
    releaseDate: yup.string().required("*Please choose release date!"),
    duration: yup.string().required("*Not be empty!"),
    trailerURL: yup.string().required("*Not be empty!").matches(/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/, "*URL youtube not valid"),
    language: yup.string().required("*Not be empty!"),
    rated: yup.string().required("*Not be empty!"),
    isShowing: yup.string().required("*Not be empty!"),
    // rated: yup.number().required("*Not be empty!").min(0, "*Điểm đánh giá phải từ 0 đến 10").integer("*Điểm đánh giá phải từ 0 đến 10").max(10, "*Điểm đánh giá phải từ 0 đến 10"),
  })

  const handleSubmit = (movieObj) => {
    // console.log("Bay vô add: ", movieObj);
    // let smallImageURl = movieObj.smallImageURl
    // let fakeImage = { srcImage, id: movieObj.id }
   
    // movieObj = { ...movieObj, releaseDate: movieObj.releaseDate.toLocaleDateString('fr-CA')}

    // if(!movieObj.smallImageURl && !movieObj.largeImageURL){
    //   movieObj = { ...movieObj,
    //   smallImageURl: image,
    //   largeImageURL: image2,
    // }}
    if (selectedPhim.id) {
      // onUpdate(movieObj, smallImageURl, fakeImage)
      onUpdate(movieObj)
      return
    }
    const newMovieObj = { ...movieObj }
    delete newMovieObj.id
    // delete newMovieObj.duration
    // delete newMovieObj.rated
    onAddMovie(newMovieObj)
  }

  const submitImage =() =>{
    const data  = new FormData()
    data.append("file", image)
    data.append("upload_preset", "hh37brtc")
    data.append("cloud_name", "dfb5p3kus")

    fetch("https://api.cloudinary.com/v1_1/dfb5p3kus/image/upload", {
      method: "post",
      body:data
    })
    .then((res) => res.json())
    .then((data) =>{
      // console.log(data.secure_url);
      setImage(data.secure_url)
      // console.log("SrcImage 1 : ", image);
    })
    .catch((err) => {
      // console.log(err);
    })
  }
  const submitImage2 =() =>{
    const data  = new FormData()
    data.append("file", image2)
    data.append("upload_preset", "hh37brtc")
    data.append("cloud_name", "dfb5p3kus")

    fetch("https://api.cloudinary.com/v1_1/dfb5p3kus/image/upload", {
      method: "post",
      body:data
    })
    .then((res) => res.json())
    .then((data) =>{
      // console.log(data.secure_url);
      setImage2(data.secure_url)
      // console.log("SrcImage 2: ", image2);
    }).catch((err) => {
      // console.log(err);
    })
  }

  return (
    <Formik
      initialValues={{
        id: selectedPhim.id,
        brief: selectedPhim.brief,
        contents:[
          {
            priority: null,
            description: selectedPhim.description,
            image: selectedPhim.image
          },
        ],
        title: selectedPhim.title,
        mainImage: selectedPhim.mainImage,

        // smallImageURl: selectedPhim.smallImageURl,
        // longDescription: selectedPhim.longDescription,
        // shortDescription: selectedPhim.shortDescription,
        // largeImageURL: selectedPhim.largeImageURL,
        // categories: selectedPhim.categories,
        // releaseDate: selectedPhim?.releaseDate ? new Date(selectedPhim.releaseDate) : new Date(),
        // duration: selectedPhim.duration,
        // trailerURL: selectedPhim.trailerURL,
        // rated: selectedPhim.rated,
        // isShowing: selectedPhim.isShowing,
      }}
      // validationSchema={movieSchema}
      onSubmit={handleSubmit}
    >{(formikProp) => (
      <Form >
        <div className="form-group">
          <label>Event Brief&nbsp;</label>
          <ErrorMessage name="brief" render={msg => <span className="text-danger">{msg}</span>} />
          <Field name="brief" className="form-control" />
        </div>
        <div className="form-group">
          <label>Main Image&nbsp;</label>
          <ErrorMessage name="mainImage" render={msg => <span className="text-danger">{msg}</span>} />
          <div className="form-row">
            <div className="col-2">
              {srcImage ? <img src={srcImage} id="image-selected" alt="movie" className="img-fluid rounded" /> : <ImageOutlinedIcon style={{ fontSize: 60 }} />}
            </div>
            <div className="col-10">
                <input type="file" name="mainImage" className="form-control" onChange={(e) => {

                  setImage(e.target.files[0])
                  // formikProp.setFieldValue("smallImageURl", srcImage)
                  }}/>

            </div>
            <button onClick={submitImage} type="button">
              Upload
            </button>
          </div>
        </div>
        <div className="form-group">
          <label>Title&nbsp;</label>
          <ErrorMessage name="title" render={msg => <span className="text-danger">{msg}</span>} />
          <Field as="textarea" name="title" className="form-control" />
        </div>
        <button type="submit" className="form-control">Submit</button>
      </Form>
    )}</Formik>
  )
}
