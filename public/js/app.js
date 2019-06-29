var io = io.connect('/');
var MyApp = (function () {
  var rangoPrecio = function(opcion){
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
  var setSearch = function(opcion){
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
    IniciarBuscador: function () {
      rangoPrecio();
      setSearch();
    }
  }
})();
$(document).ready(function () {
  MyApp.IniciarBuscador();
  io.emit("cargarControles", {msj:'Cargar controles...'});
  $("#buscar").on("click",function(){
    io.emit("mostrarPropiedades", {msj:'Cargar propiedades...'});
  })
});
io.on("cargarControles", function (data) {
  let ciudades = data.ciudades,
    tipos = data.tipos;
    console.log(ciudades.length+"+"+tipos.length);
  for(let i=0; i<ciudades.length; i++){
    $("#ciudad").append(`<option value="${ciudades[i]}">${ciudades[i]}</option>`).formSelect();
  }
  for(let j=0; j<tipos.length; j++){
    $("#tipo").append(`<option value="${tipos[j]}">${tipos[j]}</option>`).formSelect();
  }
})
io.on("mostrarPropiedades", function (data) {
  let propiedades = data.propiedades,
    longitud = propiedades.length,
    lista = $(".lista"),
    html = '';
  for(let i=0; i<longitud; i++){
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
});

