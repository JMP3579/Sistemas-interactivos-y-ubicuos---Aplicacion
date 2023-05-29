import { socket, TrandingSlider} from './script.js';
//import {lunas_vacias} from "./../../lunaVar.js";

let usuarios;
let jsonEntero;
let lunas1;

//Función que se activa al cargar la pagina y saca las lunas del JSON
async function inicio() {
  await new Promise((resolve) => {
    socket.emit('get_data');
    // Recibe los datos de las lunas
    socket.on('data', (data) => {
      jsonEntero = data;
      usuarios = jsonEntero.usuarios;
      resolve();
    });
  });
  anadirUsuariosInicio();
  for (let i = 0 ; i < usuarios.length ; i ++){
    if (usuarios[i].usuario == "Predeterminado" ){
      foto = usuarios[i].foto;
      lunas1 = lunasConseguidas(usuarios[i].lunas_pos) 
    }
  }
  socket.emit("ID_USER", { usuario : "Predeterminado" , foto : "Mario" , lunas : lunas1});

}
inicio();


var botonOK = document.getElementById("btnOK");
botonOK.addEventListener("click", anadirUsuario);
function anadirUsuariosInicio(){
  /* Funcion que añade los usuarios ya creados en el html */
  let slidesHTML = '';
  for (let i = 0; i < usuarios.length; i++){
    if (i != 0){
    const imagenURL = `../images/${usuarios[i].foto}.jpg`;
    slidesHTML += `
    <div class="swiper-slide slide" id="${usuarios[i].usuario}" data-num="1">
      <div class="slide-img">
        <img class="pfp" src="${imagenURL}" alt="${usuarios[i].foto}">
      </div>
      <div class="slide-content">
        <div class="description-top">
          <h2 class="text-center">${usuarios[i].usuario}</h2>
        </div>
      </div>
    </div>
  `;
    }
  }
  TrandingSlider.appendSlide(slidesHTML);
  TrandingSlider.update();
}

function anadirUsuario() {
  /* Funcion que añade el usuario con el nombre y la imagen introducida */
  var inputValor = document.getElementsByName("nombre")[0].value;

  const opcionSelect = document.getElementById("opcion");
  const opcionSeleccionada = opcionSelect.value;

    // Crear la URL de la imagen
    const imagenURL = `../images/${opcionSeleccionada}.jpg`;
    
    // Crear el código HTML con la imagen correspondiente
    const slidesHTML = `
      <div class="swiper-slide slide" id="${inputValor}" data-num="1">
        <div class="slide-img">
          <img class="pfp" src="${imagenURL}" alt="${opcionSeleccionada}">
        </div>
        <div class="slide-content">
          <div class="description-top">
            <h2 class="text-center">${inputValor}</h2>
          </div>
        </div>
      </div>
    `;

    TrandingSlider.appendSlide(slidesHTML);
    TrandingSlider.update();

    usuarios.push({
      "usuario": inputValor,
      "foto" : opcionSeleccionada,
      "lunas_pos":
      [
      [{"id":1,"x":120,"y":35,"conseguida":false,"nombre":"1. Sobre el pilar giratorio","t":4},
          {"id":2,"x":350,"y":630,"conseguida":false,"nombre":"2. Bajo el acantilado","t":26},
          {"id":3,"x":180,"y":280,"conseguida":false,"nombre":"3. Dentro de la jaula de piedra","t":46},
          {"id":4,"x":30,"y":180,"conseguida":false,"nombre":"4. En un árbol del pantano","t":72},
          {"id":5,"x":270,"y":300,"conseguida":false,"nombre":"5. Más allá de los Fuzzys del pantano","t":103},
          {"id":6,"x":420,"y":320,"conseguida":false,"nombre":"6. Fuzzys dentro del muro","t":125},
          {"id":7,"x":470,"y":400,"conseguida":false,"nombre":"7. Columna levadiza","t":151},
          {"id":8,"x":500,"y":120,"conseguida":false,"nombre":"8. Buenas vistas de la Isla Olvido","t":174},
          {"id":9,"x":400,"y":20,"conseguida":false,"nombre":"9. Trepidante camino a la cima","t":191}],
      [{"id":1,"x":120,"y":120,"conseguida":false,"nombre":"1. Trampilla de los témpanos","t":4},
          {"id":2,"x":300,"y":400,"conseguida":false,"nombre":"2. Trampilla del muro de hielo","t":63},
          {"id":3,"x":210,"y":210,"conseguida":false,"nombre":"3. Trampilla a ráfagas","t":108},
          {"id":4,"x":650,"y":590,"conseguida":false,"nombre":"4. Trampilla de la torre de hielo","t":147},
          {"id":5,"x":610,"y":450,"conseguida":false,"nombre":"5. Gran Premio de Friolandia","t":189},
          {"id":6,"x":150,"y":490,"conseguida":false,"nombre":"6. Entrada a Friolandia","t":262},
          {"id":7,"x":450,"y":550,"conseguida":false,"nombre":"7. Tras la torre de hielo","t":289},
          {"id":8,"x":450,"y":150,"conseguida":false,"nombre":"8. Resplandor en la nieve del pueblo","t":327},
          {"id":9,"x":550,"y":350,"conseguida":false,"nombre":"9. Sobre el arco que bate el viento","t":350}],
      [{"id":1,"x":230,"y":35,"conseguida":false,"nombre":"1. Saltos de rana sobre la niebla","t":4},
          {"id":2,"x":490,"y":455,"conseguida":false,"nombre":"2. Ranas en la cubierta","t":54},
          {"id":3,"x":120,"y":480,"conseguida":false,"nombre":"3. Contrarreloj 1 del Reino Sombrero ","t":82},
          {"id":4,"x":320,"y":180,"conseguida":false,"nombre":"4. Buenas tardes, Capitán Toad","t":118},
          {"id":5,"x":700,"y":100,"conseguida":false, "nombre":"5. De compras en Villa Chistera","t":147}
        ]
      ]})

    jsonEntero.usuarios = usuarios;
    socket.emit('update_data',  jsonEntero );
    var slides = TrandingSlider.el.querySelectorAll('.swiper-slide');
    // Iterar por cada diapositiva y buscar la ID
    let slideId = inputValor;
    for (var i = 0; i < slides.length; i++) {
      var slide = slides[i];
      if (slide.getAttribute('id') === slideId) {
        // Si encontramos la diapositiva con la ID deseada, llame al método slideTo() para ir a esa diapositiva
        TrandingSlider.slideTo(i);
        break;
      }
    }
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
 
  let distToque = Math.sqrt(Math.pow(x - ultimoX, 2) + Math.pow(y - ultimoY, 2));
  // Si se toca la pantalla 2 veces entrara en el perfil y entrara en la seleccion de mundos,
  if (longTiempo < 300 && longTiempo > 0 && distToque < dist_max) {
    const activeSlideIndex = TrandingSlider.activeIndex;
    const slides = TrandingSlider.slides;
    const activeSlideId = slides[activeSlideIndex].getAttribute('id');
    jsonEntero.usuarioActivo = activeSlideId;
    socket.emit("ENTRAR_USER" , jsonEntero);
  
    window.location.href = "http://localhost:5500/controller/mundos.html";
    
  }
  ultimoTiempo = tiempo;
  ultimoX = x;
  ultimoY = y;
});


let userAc;
let foto;
let lunastol;
TrandingSlider.on('slideChange', function () {
  /* Funcion que enviar al visualizador el usuario */
  const activeSlide = TrandingSlider.slides[TrandingSlider.activeIndex];
  userAc = activeSlide.getAttribute('id');
  for (let i = 0 ; i < usuarios.length ; i ++){
    if (usuarios[i].usuario == userAc ){
      foto = usuarios[i].foto;
      lunastol = lunasConseguidas(usuarios[i].lunas_pos) 
    }
  }
  socket.emit("ID_USER", { usuario : userAc , foto : foto , lunas : lunastol });
});

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

let lastTime = 0;
// Detecta si se está agitando el movil
if (window.DeviceMotionEvent) {
  window.addEventListener('devicemotion', function(event) {
    var aceleracion = event.accelerationIncludingGravity;
    var aceleracionX = aceleracion.x;
    var aceleracionY = aceleracion.y;
    var aceleracionZ = aceleracion.z;

    var umbral = 30;
    //Si se mueve lo suficientemente rápido en cualquier dirección envía una señal por el socket
    if (Math.abs(aceleracionX) > umbral || Math.abs(aceleracionY) > umbral || Math.abs(aceleracionZ) > umbral) {
      //Variable que haya el tiempo actual para que haya que esperar 0.7 segundos al sacudir
      var tiempoActual = Date.now();
      // Si no han pasado 0.7 segundos desde la última sacudida no se enviará ninguna señal
      if (tiempoActual - lastTime >= 700) { 
        lastTime = tiempoActual; 
        // Envía una señal para cambiar el usuario
        socket.emit("ID_USER", { usuario : userAc , foto : foto , lunas : lunastol });
        // Se desplaza al siguiente usuario
        TrandingSlider.slideNext();
      }
    }

  });
  // Si el dispositivo no es compatible con el acelerómetro se imprimirá por pantalla
} else {
  console.log("El dispositivo no admite la API del acelerómetro");
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
