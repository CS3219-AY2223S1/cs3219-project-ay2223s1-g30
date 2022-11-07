import { io } from "socket.io-client";

const URL_MATCH = process.env.URI_MATCH || "http://localhost:8001";

const socket = io(URL_MATCH);

socket.on("connect", () => {
	console.log(`I am connected via socket id: ${socket.id}`);

	socket.emit("match", "userName1", "easy", socket.id);
	//socket.emit('leave-match', "userName1")
});

socket.on("matchSuccess", (message) => {
	console.log(message);
});

socket.on("matchFail", (message) => {
	console.log(message);
});
