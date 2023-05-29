import { socket } from "./script.js";

let lunas_pos;
let luna_selec;
let brillo_anterior;
let pos_user;
let user;
let jsonEntero;
let tiempovideo = 0;
async function inicioMapa() {
  /* Funcion que carga el json y despues con los datos del json crea la pagina */
  await new Promise((resolve) => {
    socket.emit('get_data');
    // Se carga el contenido del json
    socket.on('data', (data) => {
      user = data.usuarioActivo;
      for (let i = 0; i < data.usuarios.length; i++){
        if (data.usuarios[i].usuario == user){
          pos_user = i;
          lunas_pos = data.usuarios[i].lunas_pos;
          jsonEntero = data
        }
      }
      resolve();
    });
  });
  // Se crean las lunas , carga el video y se actualiza el contrador de lunas
  agregarLunas(); 
  cargarVideo();
  lunasTotales();

  // Se selecciona la luna 1 
  luna_selec = 1;
  brillo_anterior = document.getElementById("brillo-" + 1);
  brillo_anterior.classList.add("brillo");
}
inicioMapa();


let num_mapa = document.body.classList;
let id_mapa = num_mapa - 1;

// Se selecciona el video del mundo en el que estamos
let videoSombrero = 'H9n0xPf_lSE';
let videoPerdido = 'SYDzpmZny00';
let videohielo = '28CFaFaUitY';
let videoID = videoPerdido;

if (num_mapa == 2){
  videoID = videohielo;
}else if (num_mapa == 3){
  videoID = videoSombrero;
}

socket.emit("ID_MAPA"); // Se envia la id del mapa al controlador 

socket.on("connect", function(){
  socket.emit("VIS_CONNECTED"); // Conexion del socket
  
  socket.on("CONTROL", function(data){
    /* Funcion que gestiona los controles del video*/
    control_video(data.opcion);
  });
  
  socket.on("ID_LUNA", function(data){
    /* Funcion que resalta la luna con la id enviada */
    luna_resaltado(data.luna);
    tiempovideo = data.tiempo;
    if (player.getPlayerState() == 1) {
      player.seekTo(tiempovideo);
    }
  });

  socket.on("ENTER", function(data){
    /* Funcion para salir del mapa y volver al menu de mundos */
    window.location.href = "http://localhost:5500/viz/mundos.html";
  });
})



function agregarLunas() {
  /* Funcion que agrega todas las lunas al mapa */
  let mapa = document.querySelector('.mapa'); // html del mapa
  let num_mapa = document.body.classList[0]; // numero del mapa obtenido por una clase del body
  let lunas = lunas_pos[num_mapa - 1]; // Lunas de este mapa
  for (let posicion of lunas) { // Se recorren todas las lunas de este mapa para añadirlas

    // Se añaden clases, estilos para su posicion y su id
    let contenedor = document.createElement('div');
    contenedor.classList.add('luna-contenedor');
    contenedor.style.position = 'absolute';
    contenedor.style.left = `${posicion.x}px`;
    contenedor.style.top = `${posicion.y}px`;
    contenedor.setAttribute("id" , posicion.id);
    mapa.appendChild(contenedor);

    // Dentro del contenedor creamos la imagen
    let img = document.createElement('img');
    img.src = '..//images/Luna.webp';
    img.setAttribute("id" , "img-" + posicion.id);
    if (posicion.conseguida == true) {
      img.classList.add('conseguida');
    }
    img.classList.add('luna');
    contenedor.appendChild(img);

    // Dentro del contenedor añadimos el brillo por si la luna se selecciona
    let brillo = document.createElement('div');
    brillo.setAttribute("id" , "brillo-" + posicion.id);
    contenedor.appendChild(brillo);
  }
}

function luna_resaltado(luna){
  /* Función que resalta la luna seleccionada */
  let brillo = document.getElementById("brillo-" + luna);
  brillo.classList.add("brillo"); // Añadimos la clase brillo para cambiar su css
  brillo_anterior.classList.remove("brillo"); // Quitamos la clase brillo a la anterior para que solo haya una brillando
  brillo_anterior = brillo;
  luna_selec = luna;
}

var player; // Variable del controlador de video

function cargarVideo() {
  /* Funcion que carga el video cuando se carga la pagina */
  player = new YT.Player('contenedor-video', {
    videoId: videoID,
    playerVars: {
      'enablejsapi' : 1,
      mute : 1
    },
    /*events : {
      'onReady' : onPlayerReady
    }*/

  });
}

function repVideo() {
  /* Funcion que reproduce el video */ 
  if (player && player.getPlayerState() !== YT.PlayerState.PLAYING) {
    player.playVideo();
    player.unMute(); // Lo desmuteamos por si acaso y porque comienza muteado normalmente
  }
  setTimeout(function() {
    player.seekTo(tiempovideo);
  }, 200);
  
}


function moverAlSeg(time) {
  /* Funcion para ir al segundo donde hay una luna en el video */
  if (player) {
    player.seekTo(time, true);
  }
}

function avanzarVideo(seconds) {
  /* Funcion que avanza o retrasa el video */
  if (player) {
    var currentTime = player.getCurrentTime();
    player.seekTo(currentTime + seconds, true);
  }
}

function control_video(opcion){
  /* Funcion encargada de recibir la señal y decidir que funcion debe ejecutarse */
  if (opcion == 1) {
    // Boton de play o stop
    if (player.getPlayerState() == 1) {
      player.stopVideo();
      tiempovideo = player.getCurrentTime();
    }
    else{
      repVideo();

      
    }
    
  }
  if (opcion == 2) {
    // Completar una luna
    lunaCompletada();
    lunasTotales();
  }
  if (opcion == 4) {
    // Avanzar el video
    if (player.getPlayerState() == 1) {
      avanzarVideo(5);
    }
  }
  if (opcion == 5) {
    // Retrasar el video
    if (player.getPlayerState() == 1) {
      avanzarVideo(-5);
    }
  }
  if (opcion == 6) {
    // Subir volumen
    player.unMute();
    var currentVolume = player.getVolume();
    if (currentVolume < 90) {
      player.setVolume(currentVolume + 20);
      // Subimos 20% su volumen
    } else {
      player.setVolume(100);
      // Si el volumen ya esta subido se queda en 100
    } 
  }
  if (opcion == 7) {
    // Bajar volumen
    player.unMute();
    var currentVolume = player.getVolume();
    if (currentVolume > 10) {
      player.setVolume(currentVolume - 20);
      // Bajamos 20% su volumen
    } else {
      player.setVolume(0);
      player.mute();
      // Si el volumen ya está muteado se queda muteado
    }
  }
}

function lunaCompletada() {
  /* Funcion que cambia el css de la luna que este completada */
  let lunaImg = document.getElementById("img-" + luna_selec);
  lunaImg.classList.toggle ("conseguida"); // Si ya esta conseguida , se quitara de la lista de conseguidas
  let num_mapa = document.body.classList[0];
  let lunas = lunas_pos[num_mapa - 1];
  const lunaIndex = lunas.findIndex(luna => luna.id == luna_selec); // Se busca si esa luna está o no conseguida para modificar su valor
  if (lunaIndex !== -1) {
    lunas_pos[num_mapa - 1][lunaIndex].conseguida = !lunas[lunaIndex].conseguida;
    jsonEntero.usuarios[pos_user].lunas_pos = lunas_pos;
    socket.emit('update_data',  jsonEntero );
  }
}

function lunasConseguidas () {
    /* Funcion que cuenta cuantas lunas estan conseguidas y devuelve un str con el marcador */
    let contador = 0;
    let num_mapa = document.body.classList[0]; // Obtenemos el numero del mapa del html
    let objetos = lunas_pos[num_mapa - 1] // Lunas de este mundo
    for (let i = 0; i < objetos.length; i++) {
      if (objetos[i].conseguida) {
        contador++; // Luna conseguida 
      }
    }
    contador = contador + "/" + objetos.length; // Str del contador
    return contador;
}

function lunasTotales () {
  /* Funcion que actualiza el marcador de lunas conseguidas */
  let totales = document.getElementById("lunasTotales");
  let p_totales = lunasConseguidas();
  totales.innerHTML = p_totales;
}


function todasConseguidas() {
  /* Funcion que comprueba que todas las lunas de todos los mapas estén conseguidas */
  for (let i = 0; i < lunas_pos.length; i++) { // Se recorren todas las lunas de todos los mundos
    for (let j = 0; j < lunas_pos[i].length; j++) {
      if (!lunas_pos[i][j].conseguida) {
        return false; // Si una luna no se ha conseguido devuelve false
      }
    }
  }
  return true; // Si todas las lunas se han cosneguido devuelde true
}


