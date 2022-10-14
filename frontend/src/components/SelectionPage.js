import {
	Box,
	Button,
	ButtonGroup,
	Typography,
	Card,
	CardContent,
	CardActionArea,
	Grid,
} from "@mui/material";
import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import CircularProgressWithLabel from "./CircularProgress";
import { socket } from "./services/socket";
import { URL_USER_SVC, URL_USER_SVC_DASHBOARD } from "../configs";
import axios from "axios";
import { STATUS_CODE_OKAY, STATUS_CODE_CONFLICT } from "../constants";

function SelectionPage() {
	console.log("Attempting to connect");
	// client-side
	const [socketID, handleSocketID] = useState("");
	const [difficulty, handleDifficulty] = useState("");
	//const [username, setUsername] = useState("");

	useEffect(() => {
		socket.emit("HELLO_THERE");
		socket.on("connect", () => {
			console.log(
				"Front-end connection to localhost:8001 socket successful."
			);
			console.log(" connected on socket id: " + socket.id);
			handleSocketID(socket.id);
		});
		if (sessionStorage.getItem("question") !== "") {
			async function update() {
				try {
					await updateHistory();
					sessionStorage.removeItem("question");
				} catch (err) {
					console.log(err);
				}
			}
			update();
		}
	}, []);

	console.log(socketID);
	return (
		<Box display={"flex"} flexDirection={"column"} width={"100%"}>
			<Typography variant={"h3"} marginBottom={"10rem"}>
				LeetCode Selection Page
			</Typography>
			<Grid container>
				<Grid item>
					<Card>
						<CardActionArea
							onClick={() => handleDifficulty("easy")}
						>
							<CardContent>
								<Typography
									variant={"h5"}
									gutterBottom
									component="div"
								>
									Easy Difficulty LeetCode
								</Typography>
								<Typography
									variant={"body2"}
									gutterBottom
									component="div"
								>
									Select this difficulty if you're new to
									programming!
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				</Grid>
				<Grid item>
					<Card>
						<CardActionArea
							onClick={() => handleDifficulty("medium")}
						>
							<CardContent>
								<Typography
									variant={"h5"}
									gutterBottom
									component="div"
								>
									Medium Difficulty LeetCode
								</Typography>
								<Typography
									variant={"body2"}
									gutterBottom
									component="div"
								>
									Select this if you are semi-godlike in
									programming!
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				</Grid>
				<Grid item>
					<Card>
						<CardActionArea
							onClick={() => handleDifficulty("hard")}
						>
							<CardContent>
								<Typography
									variant={"h5"}
									gutterBottom
									component="div"
								>
									Hard Difficulty LeetCode
								</Typography>
								<Typography
									variant={"body2"}
									gutterBottom
									component="div"
								>
									Select this difficulty if you are god in
									programming!
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				</Grid>
			</Grid>
			<Box>
				<ButtonGroup
					variant="contained"
					aria-label="outlined primary button group"
				>
					<Button
						fullWidth={true}
						onClick={() => handleSolo(socket, difficulty)}
					>
						Practice LeetCode Alone!
					</Button>
					<Button
						fullWidth={true}
						onClick={() => handleMatching(socket, difficulty)}
					>
						Collaborate with others!
					</Button>
				</ButtonGroup>
			</Box>
			<div id="timer"></div>
		</Box>
	);
}

const handleMatching = (socket, difficulty) => {
	sessionStorage.setItem("difficulty", difficulty);
	console.log("diff: " + difficulty);
	if (difficulty === "") {
		difficulty = "easy";
	}
	console.log(" Selected Matching with Difficulty: " + difficulty);

	// Do a socket emit to match with another user
	const username = sessionStorage.getItem("username");
	const userID = socket.id;
	console.log(
		"socket emit: match for: " +
			username +
			" queuing for difficulty: " +
			difficulty
	);
	socket.emit("match", username, difficulty, userID);

	// Timer object on ReactDOM
	let container = document.getElementById("timer");
	let root = createRoot(container);
	root.render(<CircularProgressWithLabel />);

	// Timer for 30seconds timeout for socket.emit("match-failed")
	const timer = setTimeout(() => {
		console.log(
			"socket emit: leave-match for: " +
				username +
				" queuing for difficulty: " +
				difficulty
		);
		socket.emit("leave-match", username);
		root.render("match not found!! please try again!");
	}, 30000);

	// If get match-success, clearTimeout
	socket.on("matchSuccess", (collabRoomId) => {
		clearTimeout(timer);
		root.render(
			"Match found! Please wait for us to process you into the collab room."
		);

		// TRANSPORT USER TO ROOM! AKA COLLABLEET?
		sessionStorage.setItem("collabRoomId", collabRoomId);
		window.location.replace(`/collab`);
	});
};

const handleSolo = (difficulty) => {
	sessionStorage.setItem("difficulty", difficulty);
	console.log("Selected Solo with Difficulty: " + difficulty);
};

const updateHistory = async () => {
	const user = await getUser();
	const username = sessionStorage.getItem("username");
	const question = JSON.parse(sessionStorage.getItem("question"));
	const difficulty = sessionStorage.getItem("difficulty");
	if (
		user !== "" &&
		question !== "" &&
		difficulty !== "" &&
		username != null
	) {
		console.log("UPDATING HISTORY");
		const endpoint = URL_USER_SVC + "/history";
		const easy = user.easy;
		const medium = user.medium;
		const hard = user.hard;
		console.log(question, user);
		if (difficulty === "easy") {
			if (!easy.includes(question.id)) {
				easy.push(question.id);
			}
		} else if (difficulty === "medium") {
			if (!medium.include(question.id)) {
				medium.push(question.id);
			}
		} else {
			if (!hard.include(question.id)) {
				hard.push(question.id);
			}
		}

		const res = await axios
			.post(endpoint, { username, easy, hard, medium })
			.catch((err) => {
				if (err.status === STATUS_CODE_CONFLICT) {
				} else {
					console.log("Please try again later");
				}
			});
		if (res && res.status === STATUS_CODE_OKAY) {
			console.log("You successfully updated the user's question history");
		}
	}
};

const getUser = async () => {
	const username = sessionStorage.getItem("username");
	if (username !== "") {
		const endpoint = URL_USER_SVC_DASHBOARD;
		const res = await axios.post(endpoint, { username }).catch((err) => {
			if (err.status === STATUS_CODE_CONFLICT) {
				console.log("User not found");
			} else {
				console.log("Please try again later");
			}
		});
		if (res && res.status === STATUS_CODE_OKAY) {
			return res.data;
			console.log("You successfully retrieved user1");
		}
	}
};

export default SelectionPage;
