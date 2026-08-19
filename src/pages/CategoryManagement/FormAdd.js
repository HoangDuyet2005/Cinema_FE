import React, { useState } from 'react';
import * as yup from "yup";
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { useStyles } from './styles';

export default function FormAdd({ selectedPhim, onUpdate, onAddCate }) {
  const classes = useStyles();

  const movieSchema = yup.object().shape({
    name: yup.string().required("*Không được bỏ trống!"),
  })

  const handleSubmit = (movieObj) => {
    console.log("cateObj thêm mới: ", movieObj?.name);
    // if (selectedPhim.id) {
    //   onUpdate(movieObj)
    //   return
    // }
    const newMovieObj = { ...movieObj }
    // delete newMovieObj.id
    onAddCate(newMovieObj)
  }

  return (
    <Formik
      initialValues={{
        id: selectedPhim.id,
        name: selectedPhim.name,
      }}
      validationSchema={movieSchema}
      onSubmit={handleSubmit}
    >{(formikProp) => (
      <Form >
        <div className="form-group">
          <label>Tên danh mục&nbsp;</label>
          <ErrorMessage name="name" render={msg => <span className="text-danger">{msg}</span>} />
          <Field name="name" className="form-control" />
        </div>
        <button type="submit" className="form-control">Submit</button>
      </Form>
    )}</Formik>
  )
}
