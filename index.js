const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');

app.use('/', express.static(path.join(__dirname, 'www')));

let visSocket;
let data = {};

fs.readFile('lunas.json', 'utf8', (err, fileData) => {
  if (err) throw err;

  data = JSON.parse(fileData);
});


io.on('connection', (socket) => {
  console.log(`socket connected ${socket.id}`);

  socket.on('get_data', () => {
    socket.emit('data', data);
  });
  
  socket.on('update_data', (lunasActualizadas) => {
    data = lunasActualizadas;

    fs.writeFile('lunas.json', JSON.stringify(data), 'utf8', (err) => {
      if (err) throw err;
      console.log('Archivo JSON actualizado');
    });

    io.emit('data', data);
  });

  socket.on("VIS_CONNECTED", () => {
    visSocket = socket;
  });

  socket.on("ID_MUNDO", (data) => {
    if (visSocket) visSocket.emit("ID_MUNDO", data);
  });

  socket.on("ID_USER", (data) => {
    if (visSocket) visSocket.emit("ID_USER", data);
  });

  socket.on("CARGADO", (data) => {
    if (visSocket) visSocket.emit("CARGADO", data);
  });

  socket.on("ID_LUNA", (data) => {
    if (visSocket) visSocket.emit("ID_LUNA", data);
  });

  socket.on("CONTROL", (data) => {
    if (visSocket) visSocket.emit("CONTROL", data);
  });
 
  socket.on("ACC_DATA", (data) => {
    if (visSocket) visSocket.emit("ACC_DATA", data);
  });

  socket.on("ENTER", (data) => {
    if (visSocket) visSocket.emit("ENTER", data);
  });

  socket.on("ENTRAR_USER", (data) => {
    if (visSocket) visSocket.emit("ENTRAR_USER", data);
  });

  socket.on("EXIT", (data) => {
    if (visSocket) visSocket.emit("EXIT", data);
  });

  socket.on("ID_MAPA", (data) => {
    if (visSocket) visSocket.emit("ID_MAPA", data);
  });

  socket.on("EXIT_USER", (data) => {
    if (visSocket) visSocket.emit("EXIT_USER", data);
  });
});


server.listen(5500, () => {
  console.log("Server listening...");
});
