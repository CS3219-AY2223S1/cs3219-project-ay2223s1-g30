import { io } from "socket.io-client";

const socket = io('http://localhost:8001');

socket.on('connect', () => {
    console.log(`I am connected via socket id: ${socket.id}`)
    socket.emit('match', `${socket.id}`)
    //start timer

    //timer ends
    socket.emit('leave-match', `${socket.id}`)
});



socket.on('matchSuccess', message => {
    console.log(message)
});

socket.on('matchFail', message => {
    console.log(message)
});
