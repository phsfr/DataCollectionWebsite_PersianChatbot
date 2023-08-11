module.exports.validateRegisterInput = (username, email, password) => {
  const errors = {}
  if (username.trim() === '') {
    errors.username = 'نام کاربری نمی‌تواند خالی باشد.'
  }
  if (password === '') {
    errors.password = 'گذرواژه نمی‌تواند خالی باشد.'
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}

module.exports.validateLoginInput = (username, password) => {
  const errors = {}
  if (username.trim() === '') {
    errors.username = 'نام کاربری نمی‌تواند خالی باشد.'
  }
  if (password === '') {
    errors.password = 'گذرواژه نمی‌تواند خالی باشد.'
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}

module.exports.validateRequestInput = (text) => {
  const errors = {}
  if (text.trim() === '') {
    errors.text = 'متن ورودی نمی‌تواند خالی باشد.'
  } else {
    if (text.trim().length <= 10) {
      errors.text = 'متن ورودی بسیار کوتاه است.'
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}

module.exports.validateProfileInput = (proname, projob, prospjob) => {
  const errors = {}
  if (proname.trim() === '') {
    errors.profilname = 'نام در پروفایل نمی تواند خالی باشد.'
  }
  /*if (prosex.trim() === '') {
    errors.profilsex = 'جنسیت در پروفایل نمی تواند خالی باشد.'
  }*/
  if (projob.trim() === '') {
    errors.profiljob = 'شغل در پروفایل نمی تواند خالی باشد.'
  }
  /*if (promar.trim() === '') {
    errors.profilmar = 'وضعیت تاهل در پروفایل نمی تواند خالی باشد.'
  }*/
  if (prospjob.trim() === '') {
    errors.profilspjob = 'شغل همسر در پروفایل نمی تواند خالی باشد.'
  }
  /*if (prohob.trim() === '') {
    errors.profilhobbies = 'علاقه مندیها در پروفایل نمی تواند خالی باشد.'
  }
  if (prores.trim() === '') {
    errors.profilresistance = 'محل سکونت در پروفایل نمی تواند خالی باشد.'
  }*/

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}