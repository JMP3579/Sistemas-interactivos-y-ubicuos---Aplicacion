import { TrandingSlider, socket } from './script.js';

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
  lunasTotales();

}
inicio();

// Detecta si se está agitando el movil
if (window.DeviceMotionEvent) {
  window.addEventListener('devicemotion', function(event) {
    var aceleracion = event.accelerationIncludingGravity;
    var aceleracionX = aceleracion.x;
    var aceleracionY = aceleracion.y;
    var aceleracionZ = aceleracion.z;

    var umbral = 30;
    //Si se mueve lo suficientemente rápido en cualquier dirección se mueve al siguiente mundo
    if (Math.abs(aceleracionX) > umbral || Math.abs(aceleracionY) > umbral || Math.abs(aceleracionZ) > umbral) {
      TrandingSlider.slideNext();
    }

  });
  // Si el dispositivo no es compatible con el acelerómetro se imprimirá por pantalla
} else {
  var mensaje = "El dispositivo no admite la API del acelerómetro";
  console.log(mensaje);
}

let num = 1;
// Al iniciar la aplicación se iniciará en el mundo 1 en el menú
socket.emit("ID_MUNDO", { mundo : 1 });
var swiperContainer = document.querySelector('.swiper-container');
TrandingSlider.on('slideChange', function () {
  // Guarda el índice del mundo actual
  const activeSlide = TrandingSlider.slides[TrandingSlider.activeIndex];
  num = activeSlide.getAttribute('data-num');
  socket.emit("ID_MUNDO", { mundo : num });
  // Se llama a la función que halla las lunas que ya se han recogido y actualiza el valor 
  lunasTotales();
});

let lastTouchTime = 0;
let lastTouchX = 0;
let lastTouchY = 0;
let maxTouchDistance = 20;
// EventListener que detecta si se toca la pantalla
document.addEventListener("touchstart", function(event) {
  let currentTime = new Date().getTime();
  let tapLength = currentTime - lastTouchTime;
  // Detecta la posición del toque
  let touchX = event.touches[0].clientX;
  let touchY = event.touches[0].clientY;
  let touchDistance = Math.sqrt(Math.pow(touchX - lastTouchX, 2) + Math.pow(touchY - lastTouchY, 2));
  // Si se toca lo suficientemente rápido selecciona el mundo y pasa a la sección del mapa con las lunas
  if (tapLength < 300 && tapLength > 0 && touchDistance < maxTouchDistance) {

    const activeSlide = TrandingSlider.slides[TrandingSlider.activeIndex];
    num = activeSlide.getAttribute('data-num');
    socket.emit("ENTER", { mundo : num });
    localStorage.setItem('mundo', num);
    window.location.href = "http://localhost:5500/controller/lunas.html";
  }
  lastTouchTime = currentTime;
  lastTouchX = touchX;
  lastTouchY = touchY;
});

// Función que halla las lunas que se han recogido y actualiza el contador
function lunasConseguidas () {
  let contador = 0;
  let objetos = lunas_pos[num - 1];
  // Bucle que recorre las lunas 
  for (let i = 0; i < objetos.length; i++) {
    // Si la luna ha sido recogida la añade al contador
    if (objetos[i].conseguida) {
      contador++;
    }
  }
  // Crea el contador
  contador = contador + "/" + objetos.length;
  return contador;
}
// Función que halla el total de lunas
function lunasTotales () {
  let totales = document.getElementById("lunasTotales");
  let p_totales = lunasConseguidas();
  totales.innerHTML = p_totales;
}


document.getElementById("info").onclick = function() {
  var popup = document.getElementById("popup");
  popup.style.display = "block";
  document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

document.getElementById("cerrarPopup").onclick = function() {
  var popup = document.getElementById("popup");
  popup.style.display = "none";
  document.body.style.backgroundColor = "";
}


function onTouchStart(event) {
  var deslizamientoActivado = false;
  var tipoDeslizamiento = null; // Se inicializa a null para que no de error

  // Se comprueba si se desliza con 3 dedos o con 1
  if (event.touches.length === 1 && !deslizamientoActivado) {
    // Si se toca con 3 dedos será para moverse a la pantalla de mundos
    tipoDeslizamiento = "cambiarmundo";
  }

  if (tipoDeslizamiento !== null) {
    // Se guarda la posición del toque
    var initialTouchY = event.touches[0].clientY;

    // Se llama a touchmove para ver el deslizamiento
    var onTouchMove = function(event) {
      // Se calcula la distancia
      var distanceY = initialTouchY - event.touches[0].clientY;

      switch (tipoDeslizamiento) {
        case "cambiarmundo":
          // Si la distancia es lo suficientemente larga ejecuta la función de cambiar de mundo
          if (distanceY > 250) {
            socket.emit("EXIT_USER", {});
            window.location.href = "http://localhost:5500/controller/inicio.html";

            deslizamientoActivado = true;

            document.removeEventListener('touchmove', onTouchMove);
          }
          break;
        
        default:
          break;
      }
    }
    // Añade un eventListener que detecta si se desliza
    document.addEventListener('touchmove', onTouchMove);
  }
}

// Añade un eventListener que detecta si se toca la pantalla
document.addEventListener('touchstart', onTouchStart);

document.getElementById("cambiar_usuario").onclick = function() {
  socket.emit("EXIT_USER", {});
  window.location.href = "http://localhost:5500/controller/inicio.html";
}