
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: '*',
    }
});

io.on("connection", (socket) => {
    let roomID;
    let clientsInRoom

    io.to(socket.id).emit('socketConnectedSuccessfully')
    
    socket.on('roomId', async (id) => {
        roomID = id
        await socket.join(id)
        clientsInRoom = io.sockets.adapter.rooms.get(id)
        if(clientsInRoom.size > 2 ) {
            await socket.leave(id)
            io.to(socket.id).emit('joinRoomError')
        } else {
            io.to(socket.id).emit('joinedRoomSuccessfully')
        } 
        console.log('socket joined ', clientsInRoom)

        if(io.sockets.adapter.rooms.get(id).size == 2){
            io.to(id).emit('enableGameStart')
            socket.to(roomID).emit('enableFirstSocket', {symbol: 'O', turn: true})
        } 
    })
    
    socket.on('position', (obj) => {
        socket.to(roomID).emit("positionClicked", obj);
    })

    socket.on('tic_game_end', (status) => {
        socket.to(roomID).emit("gameEnd", status);
    })

    socket.on('sentMessage', (msg) => {
        socket.to(roomID).emit("receivedMessage", msg);
    })

    
});



httpServer.listen(1234, () => {
    console.log('listening on port 1234')
});