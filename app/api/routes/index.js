const { loadRoutes } = require('../../../core/libs/utils')
const formidable = require('formidable')

module.exports = (app, addon) => {
  app.route('/api/image/upload')
    .post((req, res, next) => {
      const form = new formidable.IncomingForm()
      form.parse(req)
      let path

      form.on('fileBegin', (name, file) => {
        path = `/logo/${file.name}`
        file.path = `${process.cwd()}/public${path}`
      })

      form.on('file', (name, file) => {
        console.log(`Uploaded ${file.name}`)
      })

      form.on('end', (name, file) => {
        res.json({url: `${path}`})
      })
    })

  loadRoutes(__dirname, app, addon)
}