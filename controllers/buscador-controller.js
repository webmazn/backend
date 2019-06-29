'use strict'
/*var formidable = require('formidable'),*/
var  BuscadorController = () => {}

BuscadorController.getBuscador = (req, res, next) => {
  res.render('buscador', {
    title: ':::Buscador en Linea:::'
  })
}

/*BuscadorController.error404 = (req, res, next) => {
  let error = new Error(),
    locals = {
      title: 'Error 404',
      description: 'Recurso no encontrado',
      error: error
    }
  error.status = 404
  res.render('404', locals)
}*/

module.exports = BuscadorController
