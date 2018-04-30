module.exports = {
  apps: [{
    name: 'sports',
    script: 'app.js',
    env: {
      COMMON_VARIABLE: 'true'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
}