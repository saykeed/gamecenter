
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const port = process.env.PORT || 1234
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
			io.to(socket.id).emit('lastJoinerSymbol', {symbol: 'X', turn: false})
            socket.to(roomID).emit('firstJoinerSymbol', {symbol: 'O', turn: true})
        }
    })

	// socket.on('rejoinRoom', async (id) => {
	// 	await socket.join(id)
	// 	clientsInRoom = io.sockets.adapter.rooms.get(id)
	// 	console.log('socket re-joined ', clientsInRoom.size)
    //     if(clientsInRoom.size > 2 ) {
    //         await socket.leave(id)
    //         io.to(socket.id).emit('joinRoomError')
    //     } else {
    //         io.to(socket.id).emit('joinedRoomSuccessfully')
    //     } 
		
	// 	if(io.sockets.adapter.rooms.get(id).size == 2){
    //         io.to(id).emit('enableGameStart')
    //     } 
	// })
    
    socket.on('position', (obj) => {
        socket.to(roomID).emit("positionClicked", obj);
    })

    socket.on('tic_game_end', (status) => {
        socket.to(roomID).emit("gameEnd", status);
    })

    socket.on('sentMessage', (msg) => {
        socket.to(roomID).emit("receivedMessage", msg);
    })

    socket.on('outgoingOffer', (msg) => {
        socket.to(roomID).emit("incomingOffer", msg);
    })

    socket.on('outgoingAnswer', (msg) => {
        socket.to(roomID).emit("incomingAnswer", msg);
    })

    socket.on('rejectCall', () => {
        socket.to(roomID).emit("callRejected");
    })

    socket.on('outgoingSenderIceCandidate', (msg) => {
        socket.to(roomID).emit("incomingSenderIceCandidate", msg);
    })

    socket.on('outgoingReceiverIceCandidate', (msg) => {
        socket.to(roomID).emit("incomingReceiverIceCandidate", msg);
    })

    socket.on('gameRematch', () => {
        socket.to(roomID).emit("gameRematchRequest");
    })

    socket.on('gameRematchAccepted', () => {
        socket.to(roomID).emit("rematchAcepted");
    })

    socket.on('gameRematchRejected', () => {
        socket.to(roomID).emit("rematchRejected");
    })

    // socket.on("disconnect", (reason) => {
    //     if(reason == 'transport close') {
    //         console.log('transport close', io.sockets.adapter.rooms.get(roomID).size)
    //     }
    // });
    
});



httpServer.listen(port, () => {
    console.log(`listening on port ${port}`)
});