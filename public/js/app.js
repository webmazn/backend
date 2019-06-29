var io = io.connect('/');
var MyApp = (function () {
  var rangoPrecio = function (opcion) {
    $("#rangoPrecio").ionRangeSlider({
      type: "double",
      grid: false,
      min: 0,
      max: 100000,
      from: 1000,
      to: 20000,
      prefix: "$"
    })
  }
  var setSearch = function (opcion) {
    let busqueda = $('#checkPersonalizada')
    busqueda.on('change', (e) => {
      if (this.customSearch == false) {
        this.customSearch = true
      } else {
        this.customSearch = false
      }
      $('#personalizada').toggleClass('invisible')
    })
  }
  return {
    iniciarBuscador: function () {
      rangoPrecio();
      setSearch();
    },
    validarJSON: function (str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    }
  }
})();
$(document).ready(function () {
  MyApp.iniciarBuscador();
  io.emit("cargarControles", {
    msj: 'Cargar controles...'
  });
  $("#buscar").on("click", function () {
    let ciudad = $("#ciudad option:selected").val(),
      tipo = $("#tipo option:selected").val(),
      precio = $("#rangoPrecio").val();
    io.emit("mostrarPropiedades", {
      msj: 'Cargar propiedades...',
      ciudad: ciudad,
      tipo: tipo,
      precio: precio
    });
  })
});
io.on("cargarControles", function (data) {
  let ciudades = JSON.parse(data.ciudades),
    tipos = JSON.parse(data.tipos)
  for (let i = 0; i < ciudades.length; i++) {
    $("#ciudad").append(`<option value="${ciudades[i]}">${ciudades[i]}</option>`).formSelect();
  }
  for (let j = 0; j < tipos.length; j++) {
    $("#tipo").append(`<option value="${tipos[j]}">${tipos[j]}</option>`).formSelect();
  }
})
io.on("mostrarPropiedades", function (data) {
  let propiedades = data.propiedades,
    lista = $(".lista"),
    resultados = $("#resultados"),
    html = '';
  if (MyApp.validarJSON(propiedades)) propiedades = JSON.parse(propiedades)
  let longitud = propiedades.length
  console.log(propiedades);
  for (let i = 0; i < longitud; i++) {
    html += `
        <div class="card horizontal" data-id="${propiedades[i].Id}">
          <div class="card-image"><img src="img/home.jpg"></div>
          <div class="card-stacked">
            <div class="card-content">
              <div><b>Direccién: </b><p>${propiedades[i].Direccion}</p></div>
              <div><b>Ciudad: </b><p>${propiedades[i].Ciudad}</p></div>
              <div><b>Teléfono: </b><p>${propiedades[i].Telefono}</p></div>
              <div><b>Código postal: </b><p>${propiedades[i].Codigo_Postal}</p></div>
              <div><b>Precio: </b><p>${propiedades[i].Precio}</p></div>
              <div><b>Tipo: </b><p>${propiedades[i].Tipo}</p></div>
            </div>
          </div>
          <div class="card-action right-align"><a href="#">Ver más</a></div>
        </div>`
  }
  lista.empty().html(html);
  resultados.empty().html(`Buscador de Propiedades - ${longitud} resultado(s)`);
});
