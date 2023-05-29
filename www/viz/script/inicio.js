import { socket} from './script.js';

socket.on("connect", function(){
  socket.emit("VIS_CONNECTED"); 

  socket.on("ENTRAR_USER", function(data){
    socket.emit('update_data',  data );
    window.location.href = "http://localhost:5500/viz/mundos.html";
  });

  socket.on("ID_USER", function(data){
    document.getElementById("nombre-user").textContent = data.usuario;
    document.getElementById("img-user").src = "./../images/" + data.foto + ".jpg";
    document.getElementById("completado-user").textContent = (Math.round(data.lunas * 100 )) + "%";
    document.getElementById("barra-dentro").style.width = (data.lunas * 100 ) + "%";

  });

})


let pred;
let jsonEntero;
let lunas1;
async function inicio() {
  await new Promise((resolve) => {
    socket.emit('get_data');
    // Recibe los datos de las lunas
    socket.on('data', (data) => {
      jsonEntero = data;
      pred = jsonEntero.usuarios[0].lunas_pos;
      lunas1 = lunasConseguidas(pred) 
      document.getElementById("completado-user").textContent = (Math.round(lunas1 * 100 )) + "%";
      document.getElementById("barra-dentro").style.width = (lunas1 * 100 ) + "%";
      resolve();
    });
  });

}
inicio();

function lunasConseguidas (objetos) {
  let contador = 0;
  let lunasTotales = 0;
  // Bucle que recorre las lunas 
  for (let i = 0; i < objetos.length; i++) {
    for (let j = 0; j < objetos[i].length; j++){
      lunasTotales += 1;
    // Si la luna ha sido recogida la añade al contador
      if (objetos[i][j].conseguida) {
        contador++;
    }}
  }
  // Crea el contador
  contador = contador / lunasTotales;
  return contador;
}

