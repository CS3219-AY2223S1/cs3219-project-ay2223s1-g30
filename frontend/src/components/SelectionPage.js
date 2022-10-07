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

function SelectionPage() {
	console.log("Attempting to connect");
	// client-side
	const [socketID, handleSocketID] = useState("");
	const [difficulty, handleDifficulty] = useState("");

	useEffect(() => {
		socket.emit("HELLO_THERE");
		socket.on("connect", () => {
			console.log(
				"Front-end connection to localhost:8001 socket successful."
			);
			console.log(" connected on socket id: " + socket.id);
			handleSocketID(socket.id);
		});
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

	// Do a socket emit to Brandon with match.
	const uniqueID = "PLACEHOLDER";
	console.log(
		"socket emit: match for: " +
			uniqueID +
			" queuing for difficulty: " +
			difficulty
	);
	socket.emit("match", "DUMMYUSERNAME/UNIQUE ID", difficulty);

	// Timer object on ReactDOM
	let container = document.getElementById("timer");
	let root = createRoot(container);
	root.render(<CircularProgressWithLabel />);

	// Timer for 30seconds timeout for socket.emit("match-failed")
	const timer = setTimeout(() => {
		console.log(
			"socket emit: leave-match for: " +
				uniqueID +
				" queuing for difficulty: " +
				difficulty
		);
		socket.emit("leave-match", uniqueID);
		root.render("match not found!! please try again!");
	}, 30000);

	// If get match-success, clearTimeout
	socket.on("matchSuccess", () => {
		clearTimeout(timer);
		root.render(
			"match found!!! Please wait for us to process you into the loading room."
		);

		// TRANSPORT USER TO ROOM! AKA COLLABLEET?
	});
};

const handleSolo = (difficulty) => {
	sessionStorage.setItem("difficulty", difficulty);
	console.log("Selected Solo with Difficulty: " + difficulty);
};

export default SelectionPage;
