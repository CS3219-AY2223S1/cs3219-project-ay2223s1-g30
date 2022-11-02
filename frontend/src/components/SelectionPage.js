import {
	Box,
	Button,
	Typography,
	Toolbar,
	Card,
	CardContent,
	CardActionArea,
	Grid,
	IconButton,
	Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { socket } from "./services/socket";
import { URL_USER_SVC, URL_USER_SVC_DASHBOARD } from "../configs";
import axios from "axios";
import { STATUS_CODE_OKAY, STATUS_CODE_CONFLICT } from "../constants";
import { TimerDialog } from "./Dialog";
import MuiAppBar from "@mui/material/AppBar";
import GroupsIcon from "@mui/icons-material/Groups";
import Person from "@mui/icons-material/Person";

function SelectionPage() {
	console.log("Attempting to connect");
	const [socketID, handleSocketID] = useState("");
	const [difficulty, handleDifficulty] = useState("");
	const username = sessionStorage.getItem("username");

	// Not so good way of setting card selection, but workaround.
	const [isActiveOne, setIsActiveOne] = useState(true);
	const [isActiveTwo, setIsActiveTwo] = useState(false);
	const [isActiveThree, setIsActiveThree] = useState(false);

	const handleClick = (correctCard, disableCardOne, disableCardTwo) => {
	  correctCard(true);
	  disableCardOne(false);
	  disableCardTwo(false);
	};
	useEffect(() => {
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
			<MuiAppBar position="absolute">
				<Toolbar
					sx={{
						pr: "24px",
					}}
				>
					<IconButton
						sx={{
							color: "white",
							":hover": {
								bgcolor: "white",
								color: "black",
								boxShadow: 20,
							},
						}}
						onClick={(event) =>
							window.location.replace(`/dashboard`)
						}
					>
						<ArrowBackIcon />
					</IconButton>
					<Typography
						component="h1"
						variant="h6"
						color="inherit"
						noWrap
						sx={{ flexGrow: 1 }}
						align="center"
					>
						PeerPrep Selection Page <code>{username}</code>
					</Typography>
				</Toolbar>
			</MuiAppBar>
			<Grid
				container
				justifyContent="center"
				flexDirection="row"
				spacing={12}
				sx={{ pt: 12, display: "flex", flexDirection: "row" }}
			>
				<Grid item md={4} lg={2}>
					<Card style={{
             			boxShadow: isActiveOne ?  '5px 5px grey': '',}}>
						<CardActionArea        
						onClick={() => {
							handleDifficulty("easy")
							handleClick(setIsActiveOne, setIsActiveTwo, setIsActiveThree);
								}}
						>
							<CardContent>
								<Typography
									variant={"h5"}
									gutterBottom
									component="div"
								>
									Easy
								</Typography>
								<Typography
									variant={"body2"}
									gutterBottom
									component="div"
								>
									Select this difficulty if you are new to
									programming!
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				</Grid>
				<Grid item md={4} lg={2} xs>
				<Card style={{boxShadow: isActiveTwo ?  '5px 5px grey': ''}}>
						<CardActionArea
						onClick={() => {
							handleDifficulty("medium")
							handleClick(setIsActiveTwo, setIsActiveOne, setIsActiveThree);
								}}
						>
							<CardContent>
								<Typography
									variant={"h5"}
									gutterBottom
									component="div"
								>
									Medium
								</Typography>
								<Typography
									variant={"body2"}
									gutterBottom
									component="div"
								>
									Select this difficulty if you are pro in
									programming!
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				</Grid>
				<Grid item md={4} lg={2} xs>
				<Card style={{boxShadow: isActiveThree ?  '5px 5px grey': ''}}>
						<CardActionArea
						onClick={() => {
							handleDifficulty("hard")
							handleClick(setIsActiveThree, setIsActiveOne, setIsActiveTwo);
								}}
						>
							<CardContent>
								<Typography
									variant={"h5"}
									gutterBottom
									component="div"
								>
									Hard
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
			<Grid
				container
				justifyContent="center"
				alignItems="center"
				display="flex"
				flexDirection="row"
				sx={{ pt: 12, pb: 2}}
			>
				<Grid sx={{ mr: 10 }}>
					<Button
						variant="contained"
						size={"large"}
						startIcon={<Person />}
						sx={{
							color: "white",
							":hover": {
								bgcolor: "white",
								color: "black",
								boxShadow: 20,
							},
						}}
						onClick={() => handleSolo(socket, difficulty)}
					>
						Solo
					</Button>
				</Grid>
				<Grid item>
					<Button
						variant="contained"
						size={"large"}
						startIcon={<GroupsIcon />}
						sx={{
							color: "white",
							paddingBottom: "10px",
							":hover": {
								bgcolor: "white",
								color: "black",
								boxShadow: 20,
							},
						}}
						onClick={() => handleMatching(socket, difficulty)}
					>
						Collab
					</Button>
				</Grid>
			</Grid>
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

	// Timer for 30seconds timeout for socket.emit("match-failed")
	let timerID = timer(root, username, difficulty);
	root.render(<TimerDialog data-param={[true, timerID, socket, username]} />);

	// If get match-success, clearTimeout
	socket.on("matchSuccess", (collabRoomId) => {
		clearTimeout(timer);
		root.render(
			<Alert variant="outlined" severity="success" 
			sx={{
				width: '30%',
				margin: 'auto',
				padding: 'auto',
			  }}>
					 Match Successful! Please wait to get directed to your room!
			</Alert>
		);

		// Transport user to collab page
		sessionStorage.setItem("collabRoomId", collabRoomId);
		window.location.replace(`/collab`);
	});
};

const handleSolo = (socket, difficulty) => {
    sessionStorage.setItem("difficulty", difficulty);
    if (difficulty === "") {
        difficulty = "easy";
    }
    console.log("Selected Solo with Difficulty: " + difficulty);
    sessionStorage.setItem("isSoloMode", "true");

    const username = sessionStorage.getItem("username");
    const userID = socket.id;
    socket.emit("solo-practice", username, difficulty, userID);
    socket.on("solo-practice-success", (roomId) => {
        console.log(`Now transferring to a solo practice room. RoomId: ${roomId}`);

        // Transport user to collab page (solo mode)
        sessionStorage.setItem("collabRoomId", roomId);
        window.location.replace(`/collab`);
    });
};

// Creation of timer
const timer = (root, userName, difficulty) => {
	const timerID = setTimeout(
		handleTimeout,
		30000,
		root,
		userName,
		difficulty
	);
	return timerID;
};

// Handling 30s timeout
const handleTimeout = (root, userName, difficulty) => {
	console.log(
		"socket emit: leave-match for: " +
			userName +
			" queuing for difficulty: " +
			difficulty
	);
	socket.emit("leave-match", userName);
	root.render(
		<Alert variant="outlined" severity="error" 
		sx={{
			width: '30%',
			margin: 'auto',
			padding: 'auto',
		  }}>
  				Your 30 seconds is up! Try to match again!
		</Alert>
	);
	alert("Match not found, please try again!");
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
			if (!medium.includes(question.id)) {
				medium.push(question.id);
			}
		} else {
			if (!hard.includes(question.id)) {
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
			console.log("You successfully retrieved user!");
			return res.data;
		}
	}
};

export default SelectionPage;
