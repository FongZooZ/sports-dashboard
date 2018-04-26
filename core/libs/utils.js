// Utilities for Express app

const fs = require('fs')
const path = require('path')

const cwd = process.cwd()

/**
 * Load any route in `cwd` and apply those to the app. No exception!
 * @param {String} cwd Current working directory
 * @param {Any} args Arguments
 */
const loadRoutes = (cwd, ...args) => {
  const files = fs.readdirSync(cwd)
  for (let index in files) {
    const file = files[index]
    if (file === 'index.js') continue
    // skip non-javascript files
    if (path.extname(file) != '.js') continue

    const route = require(path.resolve(cwd, path.basename(file)))

    if (typeof route === 'function') {
      route(...args)
    }
  }
}

/**
 * Walk modules path and callback for each file
 * @param {String} modulesPath Path of modules directory
 * @param {String} excludeDir Directory to be excluded
 * @param {Function} callback Callback function
 */
const walk = (modulesPath, excludeDir, callback) => {
  fs.readdirSync(modulesPath).forEach(file => {
    var newPath = path.join(modulesPath, file)
    var stat = fs.statSync(newPath)
    if (stat.isFile() && /(.*)\.(js|coffee)$/.test(file)) {
      callback(newPath)
    } else if (stat.isDirectory() && file !== excludeDir) {
      walk(newPath, excludeDir, callback)
    }
  })
}

const assets = [
  {staticPath: '/vendors/bootstrap/dist', modulePath: '/node_modules/bootstrap/dist/'},
  {staticPath: '/vendors/react-datepicker/dist', modulePath: '/node_modules/react-datepicker/dist/'},
  {staticPath: '/vendors/font-awesome', modulePath: '/node_modules/font-awesome/'},
  {staticPath: '/vendors/admin-lte/dist', modulePath: '/node_modules/admin-lte/dist/'},
  {staticPath: '/vendors/jquery/dist', modulePath: '/node_modules/jquery/dist/'}
]

const registerStaticPath = (app, express) => {
  assets.forEach(asset => {
    app.use(asset.staticPath, express.static(`${cwd}${asset.modulePath}`))
  })
}

module.exports = {
  loadRoutes,
  walk,
  registerStaticPath
}