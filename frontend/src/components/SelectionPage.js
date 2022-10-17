import {
	Box,
	Button,
	Typography,
	Card,
	Toolbar,
	CardContent,
	CardActionArea,
	Grid,
	IconButton,
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState, useEffect } from "react";
import { createRoot } from 'react-dom/client';
import {socket} from "./services/socket";
import {TimerDialog} from "./Dialog";
import MuiAppBar from "@mui/material/AppBar"
import GroupsIcon from '@mui/icons-material/Groups';
import Person from "@mui/icons-material/Person";

function SelectionPage() {

	console.log("Attempting to connect");
	// client-side
	const [socketID, handleSocketID] = useState("");
    const [difficulty, handleDifficulty] = useState("");
    const username = sessionStorage.getItem("username");
	useEffect(() => {
		socket.emit('HELLO_THERE');
		socket.on("connect", () => {
			console.log("Front-end connection to localhost:8001 socket successful.");
			console.log(" connected on socket id: " + socket.id);
			handleSocketID(socket.id);
        });
	 }, []);
	
	console.log(socketID);
    return (
        <Box display={"flex"} flexDirection={"column"} width={"100%"}>
			<MuiAppBar position = 'absolute'>
				<Toolbar
					sx = {{
						pr: '24px',
					}}>
						<IconButton 
							sx={{ 
								color:"white",
							':hover': {
								bgcolor: "white",
								color: "black",
								boxShadow: 20,
							  },
							  }} onClick={event => window.location.replace(`/dashboard`)}>
							<ArrowBackIcon/>
						</IconButton>
						<Typography
							component = 'h1'
							variant = 'h6'
							color = 'inherit'
							noWrap
							sx = {{ flexGrow: 1 }}
							align="center">
						PeerPrep Selection Page <code>{username}</code>
					</Typography>
				</Toolbar>
			</MuiAppBar>
			<Grid container
				  justifyContent="center" 
				  flexDirection = "row"
				  spacing={12}
				  sx={{pt:12, display: 'flex', flexDirection: 'row'}}>
				<Grid item md = {4} lg = {2}>
					<Card>
						<CardActionArea onClick={() => handleDifficulty("easy")}>
							<CardContent>
								<Typography variant={"h5"} gutterBottom component="div">
									Easy
								</Typography>
								<Typography variant={"body2"} gutterBottom component="div">
									Select this difficulty if you are new to programming!
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
			</Grid>
		<Grid item md = {4} lg = {2} xs>
			<Card>
				<CardActionArea onClick={() => handleDifficulty("medium")}>
					<CardContent>
						<Typography variant={"h5"} gutterBottom component="div">
							Medium
						</Typography>
						<Typography variant={"body2"} gutterBottom component="div">
							Select this difficulty if you are pro in programming!
						</Typography>
					</CardContent>
				</CardActionArea>
			</Card>
		</Grid>
			<Grid item md = {4} lg = {2} xs>
				<Card>
					<CardActionArea onClick={() => handleDifficulty("hard")}>
						<CardContent>
							<Typography variant={"h5"} gutterBottom component="div">
								Hard
							</Typography>
							<Typography variant={"body2"} gutterBottom component="div">
								Select this difficulty if you are god in programming!
							</Typography>
						</CardContent>
					</CardActionArea>
				</Card>
			</Grid>
		</Grid>
		<Grid container
				justifyContent="center" 
				alignItems="center"
				display="flex" 
				flexDirection = "row"
				sx={{pt:12}}>
				<Grid sx={{mr:10}}>
					<Button 
					variant="contained" 
					size={"large"} 
					startIcon={<Person/>}
					onClick={() => handleSolo(socket, difficulty)}>Solo</Button>
				</Grid>
				<Grid item>
					<Button 
					variant="contained" 
					size={"large"} 
					startIcon={<GroupsIcon/>} 
					onClick={() => handleMatching(socket, difficulty)}>Collab</Button>
				</Grid>
		</Grid>
			<div id="timer"></div>
		</Box>

    )
}

const handleMatching = (socket, difficulty) => {
	console.log('diff: ' + difficulty);
	if (difficulty === "") {
		difficulty = "easy";
	}
	console.log(" Selected Matching with Difficulty: " +  difficulty );

    // Do a socket emit to match with another user
    const username = sessionStorage.getItem("username");
    const userID = socket.id;
    console.log("socket emit: match for: " + username + " queuing for difficulty: " + difficulty);
    socket.emit("match", username, difficulty, userID);

	// Timer object on ReactDOM
	let container = document.getElementById('timer');
	let root = createRoot(container);;

	// Timer for 30seconds timeout for socket.emit("match-failed")
	let timerID = timer(root, username, difficulty);
	root.render(<TimerDialog data-param={[true, timerID, socket, username]}/>);

	  // If get match-success, clearTimeout
	  socket.on("matchSuccess", (collabRoomId) => {
		clearTimeout(timer);
		root.render("Match found! Please wait for us to process you into the collab room.");

          // TRANSPORT USER TO ROOM! AKA COLLABLEET?
          sessionStorage.setItem("collabRoomId", collabRoomId)
          window.location.replace(`/collab`);
	  });
}

const handleSolo = (difficulty) => {
	console.log("Selected Solo with Difficulty: " + difficulty);
	alert("You have clicked solo!");
}

// Creation of timer
const timer = (root, userName, difficulty) => {
	const timerID = setTimeout(handleTimeout, 30000, root, userName, difficulty);
	return timerID;
}

// Handling 30s timeout
const handleTimeout = (root, userName, difficulty) => {
	console.log("socket emit: leave-match for: " + userName + " queuing for difficulty: " + difficulty);
	socket.emit("leave-match", userName);
	root.render("");
	alert("Match not found, please try again!");
}

export default SelectionPage
