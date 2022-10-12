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
import TextEditor from "./Collab/TextEditor.js";
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
		if (username !== "") {
			const endpoint = URL_USER_SVC_DASHBOARD;
			const res = await axios
				.post(endpoint, { username })
				.catch((err) => {
					if (err.status === STATUS_CODE_CONFLICT) {
						console.log("User not found");
					} else {
						console.log("Please try again later");
					}
				});
			if (res && res.status === STATUS_CODE_OKAY) {
				setUser(res.data);
				console.log("You successfully retrieved user1");
			}
		}
	};

	const getPartner = async () => {
		if (room !== "") {
			const endpoint = URL_USER_SVC_DASHBOARD;
			const username1 = username === room.user1 ? room.user2 : room.user1;
			console.log("Got partner:", username1);
			const res = await axios
				.post(endpoint, { username: username1 })
				.catch((err) => {
					console.log(err);
					if (err.status === STATUS_CODE_CONFLICT) {
						console.log("User not found");
					} else {
						console.log("Please try again later");
					}
				});
			if (res && res.status === STATUS_CODE_OKAY) {
				setPartner(res.data);
				console.log("You successfully retrieved user2");
			}
		}
	};

	const getQuestions = async () => {
		const endpoint = URL_QUESTION_SVC;
		const res = await axios.get(endpoint).catch((err) => {
			console.log("Please try again later");
		});
		setQuestions(res.data);
		sessionStorage.setItem("questions", res.data);
	};

	const findQuestion = async () => {
		if (user !== "" && partner !== "") {
			console.log("You successfully retrieved questions");
			for (let i = 0; i < questions.length; i++) {
				console.log("SETTING QNS");

				if (questions[i].difficulty === difficulty) {
					if (room === null) {
						if (difficulty === "easy") {
							if (user.easy === undefined) {
								setQuestion(questions[i]);
								break;
							} else if (!user.easy.includes(questions[i].id)) {
								setQuestion(questions[i]);
								break;
							}
						} else if (difficulty === "medium") {
							if (user.medium === undefined) {
								setQuestion(questions[i]);
								break;
							} else if (!user.medium.includes(questions[i].id)) {
								setQuestion(questions[i]);
								break;
							}
						} else {
							if (user.difficult === undefined) {
								setQuestion(questions[i]);
								break;
							} else if (
								!user.difficult.includes(questions[i].id)
							) {
								setQuestion(questions[i]);
								break;
							}
						}
					} else {
						if (difficulty === "easy") {
							if (
								user.easy === undefined &&
								partner.easy === undefined
							) {
								setQuestion(questions[i]);
								break;
							} else if (
								!user.easy.includes(questions[i].id) &&
								!partner.easy.includes(questions[i].id)
							) {
								setQuestion(questions[i]);
								break;
							}
						} else if (difficulty === "medium") {
							if (
								user.medium === undefined &&
								partner.medium === undefined
							) {
								setQuestion(questions[i]);
								break;
							} else if (
								!user.medium.includes(questions[i].id) &&
								!partner.medium.includes(questions[i].id)
							) {
								setQuestion(questions[i]);
								break;
							}
						} else {
							if (
								user.difficult === undefined &&
								partner.difficult === undefined
							) {
								setQuestion(questions[i]);
								break;
							} else if (
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
			sessionStorage.setItem("question", question);
			console.log("Got the question");
		}
	};

	const findRoom = async () => {
		if (username !== "") {
			const endpoint = URL_MATCHING_SERVICE + "/" + username;
			const res = await axios.get(endpoint, { username }).catch((err) => {
				if (err.status === STATUS_CODE_CONFLICT) {
					setRoom(null);
				} else {
					console.log("Please try again later");
				}
			});
			if (res && res.status === STATUS_CODE_OKAY) {
				setRoom(res.data);
				console.log("You successfully found the user's room");
			}
		}
	};

	useEffect(() => {
		setUsername(sessionStorage.getItem("username"));
		setDifficulty(sessionStorage.getItem("difficulty"));
		async function init() {
			console.log("No question");
			try {
				if (user === "") {
					await getUser();
				}
				if (room === "") {
					await findRoom();
				}
				if (partner === "") {
					await getPartner();
				}
				if (questions === "") {
					await getQuestions();
				}
				if (question === "") {
					findQuestion();
				}
			} catch (err) {
				console.log(err);
			}
		}
		if (question === "") {
			init();
		} else {
			console.log("Question:", question);
			setQuestion(question);
		}
	});

	return (
		<Box>
			<Typography variant={"h3"} marginBottom={"10rem"}>
				Collaborative LeetCode
			</Typography>
			<div style={{ borderColor: "red", borderStyle: "solid" }}>
				Question goes here
				{question.id}
				{question.difficulty}
				{question.title}
				{question.question}
				{question.examples}
				{question.constraints}
			</div>

			<TextEditor />

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
