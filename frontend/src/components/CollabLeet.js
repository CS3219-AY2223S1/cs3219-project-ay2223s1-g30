import {
	Box,
	Button,
	ButtonGroup,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
	Typography,
	Grid,
	createTheme,
	ThemeProvider,
	CssBaseline,
	Toolbar,
	List,
	Divider,
	IconButton,
	Badge,
	Container,
	Paper,
	styled,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import { useEffect, useState } from "react";
import axios from "axios";
import {
	URL_QUESTION_SVC,
	URL_MATCHING_SERVICE,
	URL_USER_SVC_DASHBOARD,
} from "../configs";
import { STATUS_CODE_OKAY, STATUS_CODE_CONFLICT } from "../constants";
import { Link } from "react-router-dom";
import * as React from "react";

function CollabLeet() {
	const [difficulty, setDifficulty] = useState("");
	const [question, setQuestion] = useState("");
	const [questions, setQuestions] = useState("");
	const [username, setUsername] = useState("");
	const [user, setUser] = useState("");
	const [partner, setPartner] = useState("");
	const [room, setRoom] = useState("");

	const getUser = async () => {
		const endpoint = URL_USER_SVC_DASHBOARD;
		const res = await axios.post(endpoint, { username }).catch((err) => {
			if (res.status === STATUS_CODE_CONFLICT) {
				console.log("User not found");
			} else {
				console.log("Please try again later");
			}
		});
		if (res && res.status === STATUS_CODE_OKAY) {
			setUser(res.data);
			console.log("You successfully retrieved questions");
		}
	};

	const getPartner = async () => {
		const endpoint = URL_USER_SVC_DASHBOARD;
		const username1 = username === room.user1 ? room.user2 : room.user1;
		const res = await axios.post(endpoint, { username1 }).catch((err) => {
			if (res.status === STATUS_CODE_CONFLICT) {
				console.log("User not found");
			} else {
				console.log("Please try again later");
			}
		});
		if (res && res.status === STATUS_CODE_OKAY) {
			setPartner(res.data);
			console.log("You successfully retrieved questions");
		}
	};

	const findQuestion = async () => {
		const endpoint = URL_QUESTION_SVC;
		const res = await axios.get(endpoint).catch((err) => {
			console.log("Please try again later");
		});
		if (res && res.status === STATUS_CODE_OKAY) {
			setQuestions(res.data);
			console.log("You successfully retrieved questions");
			for (let i = 0; i < questions.length; i++) {
				if (questions[i].difficulty === difficulty) {
					if (room === null) {
						if (difficulty === "easy") {
							if (!user.easy.includes(questions[i].id)) {
								setQuestion(questions[i]);
								break;
							}
						} else if (difficulty === "medium") {
							if (!user.medium.includes(questions[i].id)) {
								setQuestion(questions[i]);
								break;
							}
						} else {
							if (!user.difficult.includes(questions[i].id)) {
								setQuestion(questions[i]);
								break;
							}
						}
					} else {
						getPartner();
						if (difficulty === "easy") {
							if (
								!user.easy.includes(questions[i].id) &&
								!partner.easy.includes(questions[i].id)
							) {
								setQuestion(questions[i]);
								break;
							}
						} else if (difficulty === "medium") {
							if (
								!user.medium.includes(questions[i].id) &&
								!partner.medium.includes(questions[i].id)
							) {
								setQuestion(questions[i]);
								break;
							}
						} else {
							if (
								!user.difficult.includes(questions[i].id) &&
								!partner.difficult.includes(questions[i].id)
							) {
								setQuestion(questions[i]);
								break;
							}
						}
					}
				}
			}
		}
	};

	const findRoom = async () => {
		const endpoint = URL_MATCHING_SERVICE + "/" + username;
		const res = await axios.get(endpoint, { username }).catch((err) => {
			if (res.status === STATUS_CODE_CONFLICT) {
				setRoom(null);
			} else {
				console.log("Please try again later");
			}
		});
		if (res && res.status === STATUS_CODE_OKAY) {
			setRoom(res.data);
			console.log(room);
			console.log("You successfully found the user's room id");
		}
	};

	useEffect(() => {
		setUsername(sessionStorage.getItem("username"));
		setDifficulty(sessionStorage.getItem("difficulty"));
		getUser();
		findRoom();
		findQuestion();
	}, []);

	return (
		<Box>
			<Typography variant={"h3"} marginBottom={"10rem"}>
				Collaborative LeetCode
			</Typography>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<ButtonGroup
					variant="contained"
					aria-label="outlined primary button group"
				>
					<Button component={Link} to="/Selection">
						Go back to Selection Page
					</Button>
				</ButtonGroup>
			</div>
		</Box>
	);
}

export default CollabLeet;
