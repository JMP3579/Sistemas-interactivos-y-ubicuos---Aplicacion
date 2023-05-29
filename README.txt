///////////CONSIDERACIONES GENERALES PARA EL CORRECTO FUNCIONAMIENTO DE LA APLICACIÓN//////////

Dependiendo del dispositivo es posible que se necesite comenzar el video la primera vez de manera manual 
para que el controlador y todas sus opciones funcionen correctamente.

En nuestro caso, al utilizar un "slider" para situar las lunas en el controlador, no encontramos solución a algunos inconvenientes que
presentan la primera y última luna de cada mundo. Lo más probable es que sea por culpa de la API del slider en si.

///////////CONTROLES DE LA APLICACIÓN///////////////
#En el inicio / seleccionador de usuario:
- Desde el primer momento habrá un usuario predeterminado, por si no quieres crearte una cuenta.

- Introduce tu nombre y la foto de perfil que quieras y dale a "ok" para crear el perfil.

- Desliza para seleccionar el usuario con el slider o agita.

- Para confirmar y entrar en el doble "tap" a cualquier lugar de la pantalla.

#En el seleccionador de mundos:

-Seleccionar mundo con slider o agitar el telefono para pasar al siguiente.

-Para confirmar y entrar en el doble "tap" a cualquier lugar de la pantalla.

-Desliza con un dedo hacia arriba en la pantalla o pulsa el botón con el icono de una flecha para regresar a la seleccion de usuarios.

#En la selección de lunas

-Para usar el reconocimiento de voz solo hay que pulsar el botón con el icono de un microfono y lo que se diga a continuación será el comando.

-Seleccionar luna por medio del slider deslizando o pulsando el botón de reconocimiento por voz y diciendo "luna {numero de la luna a la que se quiere ir}"

-Reproducir video con el botón o diciendo "reproducir" o "play. 

-Detener el video con el mismo bóton de reproducir o diciendo "stop" o "parar".

-Doble "tap" en la zona derecha de la pantalla del móvil para avanzar 5s el video y doble "tap" en la zona izquierda de la pantalla del
	móvil para retroceder. También se puede hacer uso de los botones en la zona inferior del controlador. (El video debe estar reproduciendose)

-Reconocimiento por voz para subir y bajar volumen del video. Comandos: "Subir volumen", "Bajar Volumen".

-Agitar el controlador para marcar la luna como "conseguida" y pasar a la siguiente. Pulsar el botón con un "tick" para marcar la luna
	como conseguida pero sin pasar a la siguiente.

-Para volver a la selección de mundo deslizar hacía arriba en la pantalla del controlador con 1 dedo.

////////Pasos para utilizar la aplicación//////////

1. Es necesario tener conectado un móvil por usb al ordenador con port forwarding activado

2. Ejecutar en la terminal del proyecto "node index.js" para levantar el servidor

3. Abrir tanto en el visualizador como en el controlador la pagina dentro de "localhost:{"puertolevantado"}"

4. Dentro de esa página abrir link del controlador en el controlador y link del visualizador en el visualizador.

5. ¡Disfruta de la aplicación y a por esas Energilunas!
