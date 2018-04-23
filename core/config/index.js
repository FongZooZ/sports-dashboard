// Set the default node environment variable;
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'

module.exports = Object.assign(require('./env/all'), require(`./env/${process.env.NODE_ENV}`))