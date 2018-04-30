const mongoose = require('mongoose')

const User = mongoose.model('User')

const register = async (req, res, next) => {
  let count = 0
  try {
    count = await User.count()
  } catch (err) {
    return next(err)
  }
  if (count) return res.status(400).json({message: 'Cannot create more than 1 user'})

  // Validate request body
  req.check('username', 'username_empty').notEmpty()
  req.check('email', 'invalid_email').isEmail()
  req.check('password', 'invlaid_password').len(6, 50)
  req.check('confirmPassword', 'invlaid_confirm_password').len(6, 50)
  req.check('confirmPassword', 'password_unmatch').equals(req.body.password)

  const errors = req.validationErrors()

  if (errors) return res.status(400).json({ errors })

  let user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })

  try {
    await user.save()
  } catch (err) {
    return next(err)
  }

  user = user.strip()

  req.login(user, err => {
    if (err) return next(err)
    return res.redirect('/dashboard')
  })
}

const logout = (req, res, next) => {
  req.logout()

  res.format({
    json: function () {
      res.status(200).json({
        ok: true
      })
    },
    html: () => res.redirect('/'),
    text: () => res.redirect('/')
  })
}

module.exports = {
  register,
  logout
}