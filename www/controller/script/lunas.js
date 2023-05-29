import { socket, TrandingSlider} from './script.js';

$('#imagenplay').show();
$('#imagenstop').hide();
let parado = true;
let id_mundo;
let lunas;
let lunas_pos;
let pos_user;
let user;
let jsonEntero;
//Función que se activa al cargar la pagina y saca las lunas del JSON
async function inicio() {
  await new Promise((resolve) => {
    socket.emit('get_data');
    // Recibe los datos de las lunas
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
  //Halla la id del mundo para obtener las lunas que se necesitas
  id_mundo = localStorage.getItem('mundo');
  lunas = lunas_pos[id_mundo - 1];
  //Array con los nombres de los mundos
  let nombres_mundos = ["1. Reino Perdido", "2. Reino Hielo" , "3. Reino Sombrero"];
  let tituloMundo = document.querySelector('.titulo-mundo');
  //Establece el nombre del mundo al correspondiente
  tituloMundo.innerHTML = nombres_mundos[id_mundo - 1];
  socket.emit("ID_LUNA", { luna : 1 , t : lunas_pos[id_mundo - 1][0].t});
  //Llamada a la función que crea y coloca las lunas

  crearLunas();

}
inicio();
// Al iniciar la página se mueve a la luna 1
var swiperContainer = document.querySelector('.swiper-container');
let slide_actual = 1;
// Lista con el número de cada luna para pasar de texto a número utilizando la speech API
const listalunas = ["uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];

//Función que crea y coloca las lunas
function crearLunas() {
  let slidesHTML = '';
  //Para cada luna crea un elemento HTML según la luna haya sido ya recogida o no
  lunas.forEach(luna => {
    let idImg = "img-" + luna.id;
    if (luna.conseguida == true){
      slidesHTML += `
      <div class="swiper-slide slide" data-num="${luna.id}" id="${luna.id}">
        <div class="slide-img">
          <img id="${idImg}" class="conseguida" src="..//images/luna.webp" alt="${luna.nombre}">
        </div>
        <div class="slide-content">
          <div class="description-top">
            <h2 class="text-center">${luna.nombre}</h2>
          </div>
        </div>
      </div>
    `;
    }
    else {
    slidesHTML += `
      <div class="swiper-slide slide" data-num="${luna.id}" id="${luna.id}"> 
        <div class="slide-img">
          <img id="${idImg}" src="..//images/luna.webp" alt="${luna.nombre}">
        </div>
        <div class="slide-content">
          <div class="description-top">
            <h2 class="text-center">${luna.nombre}</h2>
          </div>
        </div>
      </div>
    `;
    }
  });
  // Añade las lunas al slider
  TrandingSlider.appendSlide(slidesHTML);
  //Actualiza el slider
  TrandingSlider.update();
  //Se elimina el elemento HTML por defecto, ya que por limitaciones de la API debemos crear un elemento para añadir los sliders
  TrandingSlider.removeSlide(0);
  TrandingSlider.update();

}


let lastTime = 0;
// Detecta si se está agitando el movil
if (window.DeviceMotionEvent) {
  window.addEventListener('devicemotion', function(event) {
    var aceleracion = event.accelerationIncludingGravity;
    var aceleracionX = aceleracion.x;
    var aceleracionY = aceleracion.y;
    var aceleracionZ = aceleracion.z;

    var umbral = 30;
    //Si se mueve lo suficientemente rápido en cualquier dirección envía una señal por el socket para marcar la luna como completada
    if (Math.abs(aceleracionX) > umbral || Math.abs(aceleracionY) > umbral || Math.abs(aceleracionZ) > umbral) {
      //Variable que haya el tiempo actual para que haya que esperar 0.7 segundos al sacudir
      var tiempoActual = Date.now();
      // Si no han pasado 0.7 segundos desde la última sacudida no se enviará ninguna señal y por lo tanto no se marcará como completada
      if (tiempoActual - lastTime >= 700) { 
        lastTime = tiempoActual; 
        var mensaje = "Se ha detectado una sacudida";
        cambiarConseguida();
        // Envía una señal para marcar la luna como completada
        socket.emit("CONTROL", { opcion: 2 });
        // Se desplaza a la siguiente luna
        TrandingSlider.slideNext();
      }
    }

  });
  // Si el dispositivo no es compatible con el acelerómetro se imprimirá por pantalla
} else {
  console.log("El dispositivo no admite la API del acelerómetro");
}

// Se declara la speech API para el reconocimiento de voz
const recognition = new window.webkitSpeechRecognition();
recognition.continuous = true;
// Función que detecta lo que diga por voz el usuario y lo convierte en string
recognition.onresult = function(event) {
  const last = event.results.length - 1;
  let command = event.results[last][0].transcript.toLowerCase();
  // Si el usuario dice "subir volumen" envía una señal al socket para subir el volumen un 20%
  if (command === 'subir volumen') {
    socket.emit("CONTROL" , { opcion : 6});
  // Si el usuario dice "bajar volumen" envía una señal al socket para bajar el volumen un 20%
  } else if (command === 'bajar volumen') {
    socket.emit("CONTROL" , { opcion : 7});
  }
  else if (command === 'reproducir' || command === 'play' ){
  
  if (parado == true){
    socket.emit("CONTROL" , { opcion : 1});
    $('#imagenplay').hide();
    $('#imagenstop').show();
    parado = false
  }
  }
  else if (command === 'parar' || command === 'stop'){
    if (parado == false){
      socket.emit("CONTROL" , { opcion : 1});
      $('#imagenplay').show();
      $('#imagenstop').hide();
      parado = true
    }
    }
  
  // Si el usuario dice algo que contiene la palabra luna, elimina la palabra luna del comando de voz y comprueba si lo que queda es un número
  else if (command.includes("luna")){
    //Elimina la palabra luna del comando
    command = command.replace("luna ", "");
    let lunaid;
    // Si es el resultado es una de las lunas de la lista (existente) se desplaza hacia la luna.
    for (let i = 0; i<listalunas.length; i++){
      if (command == listalunas[i]){
        lunaid = i;
        // Se desplaza hacia la luna 
        TrandingSlider.slideTo(lunaid + 1);
        // Envía una señal para que en el visualizador se actualice la luna actual
        socket.emit("ID_LUNA", { luna : lunaid, tiempo: lunas_pos[id_mundo - 1][lunaid].t });
      }
    }
  }
  document.getElementById("speech").style.backgroundColor = "purple";
};

// El speech se activa si se pulsa el botón del micrófono
document.getElementById("speech").onclick = function() {
  document.getElementById("speech").style.backgroundColor = "pink";
  recognition.start();
  setTimeout(() => {
    recognition.abort();
    document.getElementById("speech").style.backgroundColor = "purple";
  }, 3000);
  
  navigator.vibrate(500);
}



// Si se detecta un slide se cambia a la luna requerida
TrandingSlider.on('slideChange', function () {
  const activeSlide = TrandingSlider.slides[TrandingSlider.activeIndex];
  const num = activeSlide.getAttribute('data-num');
  slide_actual = num; 
  // Se envía la señal al visualizador para que actualice la luna actual en el mapa
  socket.emit("ID_LUNA", { luna : num , tiempo:lunas_pos[id_mundo - 1][num - 1].t});
});



// Función que detecta cuando el usuario toca la pantalla
function onTouchStart(event) {
  if (event.touches.length === 1 && !deslizamientoActivado){
  var deslizamientoActivado = false;
  var initialTouchY = event.touches[0].clientY;
  var initialTouchX = event.touches[0].clientX;

  // Se llama a touchmove para ver el deslizamiento
  var onTouchMove = function(event) {
    // Se calcula la distancia
    var distanceY = initialTouchY - event.touches[0].clientY;
    var distanceX = initialTouchX - event.touches[0].clientX
    var anchura = window.innerWidth;
    var altura = window.innerHeight;
    var porcentajealtura = distanceY / altura;
    var porcentajeanchura = distanceX / anchura;
        // Si la distancia es lo suficientemente larga ejecuta la función de cambiar de mundo
    if (porcentajealtura > 0.4) {
      socket.emit("ENTER", {});
      window.location.href = "http://localhost:5500/controller/mundos.html";

      deslizamientoActivado = true;

      document.removeEventListener('touchmove', onTouchMove);
    }
      
  }
    // Añade un eventListener que detecta si se desliza
  document.addEventListener('touchmove', onTouchMove);
}}
// Añade un eventListener que detecta si se toca la pantalla
document.addEventListener('touchstart', onTouchStart);

// Si se le da al boton de "play" envía una señal al visalizador para que reproduzca el video
document.getElementById("play").onclick = function() {
  socket.emit("CONTROL" , { opcion : 1});
  if (parado == true){
    $('#imagenplay').hide();
    $('#imagenstop').show();
    parado = false
  }
  else{
    $('#imagenplay').show();
    $('#imagenstop').hide();
    parado = true
  }

}
// Si se le da al boton de "tick" envía una señal al visalizador para que marque la luna como recogida y cambia el color de la luna en el controlador
document.getElementById("tickBoton").onclick = function() {
  cambiarConseguida();
  socket.emit("CONTROL" , { opcion : 2});
}
// Si se le da al botón de "+5" envía una señal al visualiador para que pase 5 segundos hacia delante el video
document.getElementById("tmas5").onclick = function() {
  socket.emit("CONTROL" , { opcion : 4});
}
// Si se le da al botón de "-5" envía una señal al visualiador para que pase 5 segundos hacia atrás el video
document.getElementById("tmenos5").onclick = function() {
  socket.emit("CONTROL" , { opcion : 5});
}
// Función que cambia el color de la luna si ya está conseguida
function cambiarConseguida() {
  let id = "img-" + slide_actual;
  let luna = document.getElementById(id);
  luna.classList.toggle('conseguida');
}


let ultimoTiempo = 0;
let ultimoX = 0;
let ultimoY = 0;
let dist_max = 20;
// Función que detecta si se toca la pantalla para pasar 5 segundos hacia delante o hacia atrás
document.addEventListener("touchstart", function(event) {
  let tiempo = new Date().getTime();
  let longTiempo = tiempo - ultimoTiempo;
  //Halla la posición del toque
  let x = event.touches[0].clientX;
  let y = event.touches[0].clientY;

  var anchura = window.innerWidth;
  
  let distToque = Math.sqrt(Math.pow(x - ultimoX, 2) + Math.pow(y - ultimoY, 2));
  // Si se toca la pantalla 2 veces de forma rápida adelanta o retrasa el video
  if (longTiempo < 500 && longTiempo > 0 && distToque < dist_max) {
    // Si se toca en la izquierda retrasa el video 5 segundos
    if (x < anchura/2) {
      socket.emit("CONTROL" , { opcion : 5});
      
    }
    // Si se toca en la derecha adelanta el video 5 segundos
     else {
      socket.emit("CONTROL" , { opcion : 4});
    }

  }
  ultimoTiempo = tiempo;
  ultimoX = x;
  ultimoY = y;
});

//Funcion que muestra el popup cuando clickas en el boton de informacion
document.getElementById("info").onclick = function() {
  var popup = document.getElementById("popup");
  popup.style.display = "block";
  document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

//Funcion que cierra el popup cuando clickas en la cruz de este
document.getElementById("cerrarPopup").onclick = function() {
  var popup = document.getElementById("popup");
  popup.style.display = "none";
  document.body.style.backgroundColor = "";
}

//Funcion para volver a la seleccion de mundo cuando clickes el boton de volver
document.getElementById("cambiar_mundo").onclick = function() {
  socket.emit("ENTER", {});
  window.location.href = "http://localhost:5500/controller/mundos.html";
}