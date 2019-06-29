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
  $("#buscar").on("click",function(){
    console.log('mostrar todo');
    io.emit("mostrarTodo", {msj:'Cargar todo...'});
  })
});
io.on("mostrarTodo", function (data) {
  let propiedades = data.propiedades;
  let longitud = propiedades.length;
  let lista = $(".lista");
  let html = '';
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

