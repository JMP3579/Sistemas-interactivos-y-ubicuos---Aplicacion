
import { socket } from "./script.js";
socket.on("connect", function(){
  socket.emit("VIS_CONNECTED"); // Conexion del socket

  socket.on("ID_MUNDO", function(data){
    //Funcion que marca en el visualizador el mundo recibido por el controlador
    mundo_resaltado(data.mundo);
  });

  socket.on("ENTER", function(data){
    //Funcion para redirigir la pagina al mapa del mundo seleccionado
    ir_mapa(data.mundo);
  });

  socket.on("EXIT_USER", function(data){
    //Funcion para redirigir la pagina a la selección de usuario
    window.location.href = "http://localhost:5500/viz/inicio.html";
  });

})

let nombres_mundos = ["1. Reino Perdido", "2. Reino Hielo" , "3. Reino Sombrero"];
let imagenes_mundos = ["images/ReinoPerdido.webp" , "images/ReinoHielo.webp" , "images/ReinoSombrero.jpg"]
let mundo_anterior =  document.getElementById('mundo-1')
function mundo_resaltado (mundo){
  //Funcion que marca en el visualizador el mundo recibido por el controlador
  mundo_anterior.classList.remove('active'); //Desmarcamos el mundo seleccionado anterior
  let id = "mundo-" + mundo;
  let mundo_actual = document.getElementById(id); 
  mundo_actual.classList.add('active'); //Marcamos el nuevo mundo
  mundo_anterior = mundo_actual;

  //Cambiamos los elementos caracteristicos de cada mundo en su visualizador como el nombre y la imagen
  let nombreH1 = document.getElementById('nombre-mundo'); 
  nombreH1.textContent = nombres_mundos[mundo - 1];
  let imagen_mundo = document.getElementById('imagen-mundo'); 
  imagen_mundo.src = imagenes_mundos[mundo - 1]
}

function ir_mapa(mundo){
  //Funcion para redirigir la pagina al mapa del mundo seleccionado
  if (mundo == 1){
    //Mapa del Reino Perdido
    window.location.href = "http://localhost:5500/viz/mapa.html";
  }
  else if (mundo == 2){
    //Mapa del Reino Hielo
    window.location.href = "http://localhost:5500/viz/mapa2.html";
  }
  else if (mundo == 3){
    //Mapa del Reino Sombrero
    window.location.href = "http://localhost:5500/viz/mapa3.html";
  }
}

export { socket };
