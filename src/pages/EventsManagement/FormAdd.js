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
  const [srcImage, setSrcImage] = useState(selectedPhim?.smallImageURl)
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
    console.log("Bay vô add: ", movieObj);
    // let smallImageURl = movieObj.smallImageURl
    // let fakeImage = { srcImage, id: movieObj.id }
   
    movieObj = { ...movieObj, releaseDate: movieObj.releaseDate.toLocaleDateString('fr-CA')}

    if(!movieObj.smallImageURl && !movieObj.largeImageURL){
      movieObj = { ...movieObj,
      smallImageURl: image,
      largeImageURL: image2,
    }}
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
      console.log("SrcImage 1 : ", image);
    })
    .catch((err) => {
      console.log(err);
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
      console.log("SrcImage 2: ", image2);
    }).catch((err) => {
      console.log(err);
    })
  }

  return (
    <Formik
      initialValues={{
        id: selectedPhim.id,
        name: selectedPhim.name,
        smallImageURl: selectedPhim.smallImageURl,
        longDescription: selectedPhim.longDescription,
        shortDescription: selectedPhim.shortDescription,
        largeImageURL: selectedPhim.largeImageURL,
        director: selectedPhim.director,
        actors: selectedPhim.actors,
        categories: selectedPhim.categories,
        releaseDate: selectedPhim?.releaseDate ? new Date(selectedPhim.releaseDate) : new Date(),
        duration: selectedPhim.duration,
        trailerURL: selectedPhim.trailerURL,
        rated: selectedPhim.rated,
        isShowing: selectedPhim.isShowing,
      }}
      // validationSchema={movieSchema}
      onSubmit={handleSubmit}
    >{(formikProp) => (
      <Form >
        <div className="form-group">
          <label>Movie's Name&nbsp;</label>
          <ErrorMessage name="name" render={msg => <span className="text-danger">{msg}</span>} />
          <Field name="name" className="form-control" />
        </div>
        <div className="form-group">
          <label>Trailer URL&nbsp;</label>
          <ErrorMessage name="trailerURL" render={msg => <span className="text-danger">{msg}</span>} />
          <Field name="trailerURL" className="form-control" />
        </div>
        <div className="form-group">
          <label>Image&nbsp;</label>
          <ErrorMessage name="smallImageURl" render={msg => <span className="text-danger">{msg}</span>} />
          <div className="form-row">
            <div className="col-2">
              {srcImage ? <img src={srcImage} id="image-selected" alt="movie" className="img-fluid rounded" /> : <ImageOutlinedIcon style={{ fontSize: 60 }} />}
            </div>
              {/* <input type="file" name="smallImageURl" accept=".jpg,.png" className="form-control" onChange={(e) => {
                formikProp.setFieldValue("smallImageURl", e.currentTarget.files[0])
                setThumbnailPreviews(e)
              }} /> */}
            <div className="col-10">
                <input type="file" name="smallImageURl" className="form-control" onChange={(e) => {

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
          <label>Large Image&nbsp;</label>
          <ErrorMessage name="largeImageURL" render={msg => <span className="text-danger">{msg}</span>} />
          <div className="form-row">
            <div className="col-2">
              {srcImage2 ? <img src={srcImage2} id="image-selected" alt="movie" className="img-fluid rounded" /> : <ImageOutlinedIcon style={{ fontSize: 60 }} />}
            </div>
            {/* <div className="col-10">
              <input type="file" name="largeImageURL" accept=".jpg,.png" className="form-control" onChange={(e) => {
                formikProp.setFieldValue("largeImageURL", e.currentTarget.files[0])
                setThumbnailPreviews(e)
              }} />
            </div> */}
            <div className="col-10" >
                <input type="file" name="largeImageURL" className="form-control" onChange={(e) => 
                  {
                    
                    setImage2(e.target.files[0])
                    // formikProp.setFieldValue("largeImageURL", srcImage2)
                  }
                    }/>
            </div>
            <button onClick={submitImage2} type="button">
              Upload
            </button>
          </div>
          {/* <div>
            <button onClick={submitImage} type="button">
              Upload
            </button>
          </div> */}
        </div>
        <div className="form-group">
          <label>Short Description&nbsp;</label>
          <ErrorMessage name="shortDescription" render={msg => <span className="text-danger">{msg}</span>} />
          <Field as="textarea" name="shortDescription" className="form-control" />
        </div>
        <div className="form-group">
          <label>Long Description&nbsp;</label>
          <ErrorMessage name="longDescription" render={msg => <span className="text-danger">{msg}</span>} />
          <Field as="textarea" name="longDescription" className="form-control" />
        </div>
        <div className="form-group">
          <label>Director&nbsp;</label>
          <ErrorMessage name="director" render={msg => <span className="text-danger">{msg}</span>} />
          <Field name="director" className="form-control" />
        </div>
        <div className="form-group">
          <label>Actors&nbsp;</label>
          <ErrorMessage name="actors" render={msg => <span className="text-danger">{msg}</span>} />
          <Field name="actors" className="form-control" />
        </div>
        <div className="form-group">
          <label>Categories&nbsp;</label>
          <ErrorMessage name="categories" render={msg => <span className="text-danger">{msg}</span>} />
          <Field name="categories" className="form-control" />
        </div>
        <div className="form-group">
          <label>Release Date&nbsp;</label>
          <ErrorMessage name="releaseDate" render={msg => <span className="text-danger">{msg}</span>} />
          <FormControl className={classes.formControl} focused={false}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <ThemeProvider theme={materialTheme}>
                <KeyboardDatePicker
                  value={formikProp.values.releaseDate}
                  onChange={date => formikProp.setFieldValue('releaseDate', date)}
                  format="yyyy-MM-dd"
                />
              </ThemeProvider>
            </MuiPickersUtilsProvider>
          </FormControl>
        </div>
        <div className="form-group">
          <label>Duration&nbsp;</label>
          <ErrorMessage name="duration" render={msg => <span className="text-danger">{msg}</span>} />
          <Field name="duration" type="number" className="form-control" />
        </div>
        <div className="form-group">
          <label>Language&nbsp;</label>
          <ErrorMessage name="language" render={msg => <span className="text-danger">{msg}</span>} />
          <Field name="language" className="form-control" />
        </div>
        {/* <div className="form-group" hidden={selectedPhim.id ? false : true}> */}
        <div className="form-group">
          <label>Rate&nbsp;</label>
          <ErrorMessage name="rated" render={msg => <span className="text-danger">{msg}</span>} />
          <Field name="rated" className="form-control" />
        </div>
        <div className="form-group">
          <label>Is Showing&nbsp;</label>
          <ErrorMessage name="isShowing" render={msg => <span className="text-danger">{msg}</span>} />
          <Field name="isShowing" type="number"  className="form-control" />
        </div>
        <button type="submit" className="form-control">Submit</button>
      </Form>
    )}</Formik>
  )
}
