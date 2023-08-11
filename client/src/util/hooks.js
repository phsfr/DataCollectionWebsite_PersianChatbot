import { useState } from 'react'

export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState)
  const [errors, setErrors] = useState({})

  const onChange = (event) => {
    if (errors.hasOwnProperty(event.target.name)) {
      if (event.target.value.trim() !== '') {
        let newErrors = errors
        delete newErrors[event.target.name]
        setErrors(newErrors)
      }
    }
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  const onSubmit = (event) => {
    event.preventDefault()
    callback()
  }

  return {
    onChange,
    onSubmit,
    values,
    setValues,
    errors,
    setErrors,
  }
}
