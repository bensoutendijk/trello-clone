const proxy = require('http-proxy-middleware');

module.exports = (app) => {
  if (process.env.NODE_ENV === 'production') {
    app.use(proxy('/api', { target: 'https://soutendijk-starter.herokuapp.com/' }));
  } else {
    app.use(proxy('/api', { target: 'http://localhost:5000/' }));
  }
};