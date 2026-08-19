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

export default function FormInput({ selectedPhim, onUpdate, onAddMovie }) {
  const classes = useStyles();
  const [srcImage, setSrcImage] = useState(selectedPhim?.smallImageURl)

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
    trailerURL: yup.string().required("*Not be empty!").matches(/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/, "*URL youtube not valid"),
    smallImageURl: yup.string().required("*Please choose image!"),
    longDescription: yup.string().required("*Not be empty!").min(50, "Mô tả cần 100 ký tự trở lên!"),
    releaseDate: yup.string().required("*Please choose release date!"),
    // rated: yup.number().required("*Not be empty!").min(0, "*Điểm đánh giá phải từ 0 đến 10").integer("*Điểm đánh giá phải từ 0 đến 10").max(10, "*Điểm đánh giá phải từ 0 đến 10"),
  })

  const handleSubmit = (movieObj) => {
    console.log("Bay vô add: ");
    let smallImageURl = movieObj.smallImageURl
    let fakeImage = { srcImage, id: movieObj.id }
    movieObj = { ...movieObj, releaseDate: movieObj.releaseDate.toLocaleDateString('en-GB') }
    if (selectedPhim.id) {
      onUpdate(movieObj, smallImageURl, fakeImage)
      return
    }
    const newMovieObj = { ...movieObj }
    delete newMovieObj.id
    delete newMovieObj.duration
    delete newMovieObj.rated
    onAddMovie(newMovieObj)
  }

  return (
    <Formik
      initialValues={{
        id: selectedPhim.id,
        name: selectedPhim.name,
        duration: selectedPhim.duration,
        trailerURL: selectedPhim.trailerURL,
        smallImageURl: selectedPhim.smallImageURl,
        longDescription: selectedPhim.longDescription,
        // maNhom: 'GP09',
        releaseDate: selectedPhim?.releaseDate ? new Date(selectedPhim.releaseDate) : new Date(),
        // rated: selectedPhim.rated,
      }}
      validationSchema={movieSchema}
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
            <div className="col-10">
              <input type="file" name="smallImageURl" accept=".jpg,.png" className="form-control" onChange={(e) => {
                formikProp.setFieldValue("smallImageURl", e.currentTarget.files[0])
                setThumbnailPreviews(e)
              }} />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>Description&nbsp;</label>
          <ErrorMessage name="longDescription" render={msg => <span className="text-danger">{msg}</span>} />
          <Field as="textarea" name="longDescription" className="form-control" />
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
        <div className="form-group" hidden={selectedPhim.id ? false : true}>
          <label>Rate&nbsp;</label>
          <ErrorMessage name="rated" render={msg => <span className="text-danger">{msg}</span>} />
          <Field name="rated" type="number" className="form-control" />
        </div>
        <button type="submit" className="form-control">Submit</button>
      </Form>
    )}</Formik>
  )
}
