'use strict'
var express = require('express'),
  app = express(),
  http = require('http').createServer(app),
  io = require('socket.io')(http),
  fs = require('fs'),
  cookieParser = require('cookie-parser'),
  minifyHTML = require('express-minify-html'),
  bodyParser = require('body-parser'),
  restFul = require('express-method-override')('_method'),
  pug = require('pug'),
  routes = require('./routes/routes'),
  publicDir = express.static(`${__dirname}/public`),
  viewDir = `${__dirname}/views`,
  port = (process.env.PORT || 7777)

app.set('views', viewDir)
  .set('view engine', 'pug')
  .set('view options', {
    pretty: false
  })
  .set('port', port)
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({
    extended: false
  }))
  .use(minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      minifyJS: true
    }
  }))
  .use(cookieParser())
  .use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    res.header('Access-Control-Allow-Credentials', true)
    next()
  })
  .use(restFul)
  .use(publicDir)
  .use(routes)

http.listen(port, () => console.log('Iniciando Express y Socket.IO en localhost: %d', port));

io.on("connection", (socket) => {

  socket.on('cargarControles', (data) => {
    let msj = data.msj,
      arrayCiudad = [],
      arrayTipo = []
    console.log(msj)
    fs.readFile(`${__dirname}/public/js/data.json`, (err, data) => {
        if (err) throw err
        let propiedades = JSON.parse(data), //JSON.stringify(data);
          longitud = propiedades.length
        for(let i=0; i<longitud; i++){
          if(!arrayCiudad.includes(propiedades[i].Ciudad)) arrayCiudad.push(propiedades[i].Ciudad)
          if(!arrayTipo.includes(propiedades[i].Tipo)) arrayTipo.push(propiedades[i].Tipo)
        }
        let ciudades = arrayCiudad.sort(),
          tipos = arrayTipo.sort()
        socket.emit("cargarControles", {ciudades:ciudades, tipos:tipos})
    });
  })

  socket.on('mostrarPropiedades', (data) => {
    let msj = data.msj
    console.log(msj)
    fs.readFile(`${__dirname}/public/js/data.json`, (err, data) => {
        if (err) throw err
        let propiedades = JSON.parse(data) //JSON.stringify(data);
        socket.emit("mostrarPropiedades", {propiedades:propiedades})
    });
  })

})

module.exports = app
