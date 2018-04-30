exports.requireLogin = (req, res, next) => {
  if (req.isAuthenticated()) return next()

  res.format({
    json: function () {
      res.status(401).json({
        message: 'User is not authorized'
      })
    },
    html: () => res.redirect('/login'),
    text: () => res.redirect('/login')
  })
}