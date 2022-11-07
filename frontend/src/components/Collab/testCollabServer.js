import { URI_FRONTEND_SVC } from "../../configs";

const io = require("socket.io")(3001, {
	cors: {
		origin: URI_FRONTEND_SVC,
		methods: ["GET", "POST"],
	},
});


io.on("connection", (socket) => {
	socket.on("send-changes", (delta) => {
		socket.broadcast.emit("receive-changes", delta);
	});
	console.log("connected");
});
