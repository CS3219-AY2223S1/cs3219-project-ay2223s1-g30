import { io } from "socket.io-client";

const socket = io('http://localhost:8001');

socket.on('connect', () => {
    console.log(`I am connected to ${socket.id}`)
    socket.emit('match-request', `Please create a match object (${socket.id})`)
});

socket.on('match', message => {
    console.log(message)
});
