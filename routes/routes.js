'use strict'
var BuscadorController = require('../controllers/buscador-controller'),
  express = require('express'),
  router = express.Router()

router
  .get('/', BuscadorController.getBuscador)
  //.use(BuscadorController.error404)

module.exports = router
