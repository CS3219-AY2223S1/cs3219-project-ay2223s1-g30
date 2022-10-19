import {
	Box,
	Button,
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
	Container,
	Paper,
	styled,
	IconButton,
	Card,
	CardActionArea,
	CardContent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GroupsIcon from "@mui/icons-material/Groups";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import { useEffect, useState } from "react";
import axios from "axios";
import {
	URL_USER_SVC,
	URL_USER_SVC_DASHBOARD,
	URL_USER_SVC_LOGOUT,
	URL_QUESTION_SVC,
	URL_MATCHING_SERVICE,
} from "../configs";
import {
	STATUS_CODE_OKAY,
	STATUS_CODE_CONFLICT,
	STATUS_CODE_FORBIDDEN,
	STATUS_CODE_UNAUTHORIZED,
} from "../constants";
import { Link } from "react-router-dom";
import * as React from "react";
import { socket } from "./services/socket";
import { TimerDialog } from "./Dialog";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import RedditIcon from "@mui/icons-material/Reddit";
import HomeIcon from "@mui/icons-material/Home";
import PasswordIcon from "@mui/icons-material/Password";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { createRoot } from "react-dom/client";
import Person from "@mui/icons-material/Person";
function Dashboard() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [dialogTitle, setDialogTitle] = useState("");
	const [dialogMsg, setDialogMsg] = useState("");
	const [isChangePasswordSuccess, setIsChangePasswordSuccess] =
		useState(false);
	const [isChangePasswordFail, setIsChangePasswordFail] = useState(false);
	const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [isCookieVerified, setIsCookieVerified] = useState(false);
	const [socketID, handleSocketID] = useState("");
	const [difficulty, setDifficulty] = useState("");
	const [question, setQuestion] = useState("");
	const [questions, setQuestions] = useState("");
	const [user, setUser] = useState("");
	const [partner, setPartner] = useState("");
	const [room, setRoom] = useState("");

	const handleChangePassword = async () => {
		const endpoint = URL_USER_SVC + "/" + username;
		const res = await axios
			.put(endpoint, { username, password })
			.catch((err) => {
				setIsChangingPassword(true);
				setIsChangePasswordFail(true);
				if (err.response.status === STATUS_CODE_CONFLICT) {
					setErrorDialog("No such user found!");
				} else if (err.response.status === STATUS_CODE_FORBIDDEN) {
					setErrorDialog(err.response.data.message);
				} else {
					setErrorDialog("Please try again later");
				}
			});
		if (res && res.status === STATUS_CODE_OKAY) {
			setIsChangePasswordSuccess(true);
			setIsChangingPassword(false);
			setSuccessDialog("You successfully changed your password");
		}
	};

	const handleDelete = async () => {
		const endpoint = URL_USER_SVC + "/" + username;
		const res = await axios.delete(endpoint, { username }).catch((err) => {
			if (err.response.status === STATUS_CODE_CONFLICT) {
				setErrorDialog("No such user found!");
			} else {
				setErrorDialog("Please try again later");
			}
		});
		if (res && res.status === STATUS_CODE_OKAY) {
			setSuccessDialog("You successfully deleted your account");
			setIsDeleteSuccess(true);
		}
	};

	// Check on landing to make sure cookie are still valid
	const verifyCookie = async () => {
		const endpoint = URL_USER_SVC_DASHBOARD;
		const res = await axios.get(endpoint).catch((err) => {
			if (err.response.status === STATUS_CODE_UNAUTHORIZED) {
				setErrorDialog("User not authorized!");
			} else {
				setErrorDialog("Please try again later");
			}
		});
		if (res && res.status === STATUS_CODE_OKAY) {
			console.log("Successfully Logged in");
			setIsCookieVerified(true);
		}
	};

	// Currently using name to see who to log out
	const handleLogout = async () => {
		const endpoint = URL_USER_SVC_LOGOUT;
		const res = await axios.post(endpoint, { username }).catch((err) => {
			if (err.response.status === STATUS_CODE_CONFLICT) {
				setErrorDialog("No such user found!");
			} else {
				setErrorDialog("Please try again later");
			}
		});
		if (res && res.status === STATUS_CODE_OKAY) {
			setUsername(undefined);
			console.log("Successfully Logged out");
		}
	};

	const changingPassword = () => {
		setIsChangingPassword(true);
		setIsChangePasswordFail(false);
		setDialogTitle("Change your password");
	};

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
				sessionStorage.setItem("user", JSON.stringify(res.data));
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
		console.log("You successfully retrieved questions");
	};

	const findQuestion = async () => {
		if (user !== "" && partner !== "" && questions !== "") {
			for (let i = 0; i < questions.length; i++) {
				console.log("Finding question");
				if (questions[i].difficulty === difficulty) {
					if (room === null) {
						if (difficulty === "easy") {
							if (user.easy === undefined) {
								setQuestion(questions[i]);
								sessionStorage.setItem(
									"question",
									JSON.stringify(questions[i])
								);
								break;
							} else if (!user.easy.includes(questions[i].id)) {
								setQuestion(questions[i]);
								sessionStorage.setItem(
									"question",
									JSON.stringify(questions[i])
								);
								break;
							}
						} else if (difficulty === "medium") {
							if (user.medium === undefined) {
								setQuestion(questions[i]);
								sessionStorage.setItem(
									"question",
									JSON.stringify(questions[i])
								);
								break;
							} else if (!user.medium.includes(questions[i].id)) {
								setQuestion(questions[i]);
								sessionStorage.setItem(
									"question",
									JSON.stringify(questions[i])
								);
								break;
							}
						} else {
							if (user.difficult === undefined) {
								setQuestion(questions[i]);
								sessionStorage.setItem(
									"question",
									JSON.stringify(questions[i])
								);
								break;
							} else if (
								!user.difficult.includes(questions[i].id)
							) {
								setQuestion(questions[i]);
								sessionStorage.setItem(
									"question",
									JSON.stringify(questions[i])
								);
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
								sessionStorage.setItem(
									"question",
									JSON.stringify(questions[i])
								);
								break;
							} else if (
								!user.easy.includes(questions[i].id) &&
								!partner.easy.includes(questions[i].id)
							) {
								setQuestion(questions[i]);
								sessionStorage.setItem(
									"question",
									JSON.stringify(questions[i])
								);
								break;
							}
						} else if (difficulty === "medium") {
							if (
								user.medium === undefined &&
								partner.medium === undefined
							) {
								setQuestion(questions[i]);
								sessionStorage.setItem(
									"question",
									JSON.stringify(questions[i])
								);
								break;
							} else if (
								!user.medium.includes(questions[i].id) &&
								!partner.medium.includes(questions[i].id)
							) {
								setQuestion(questions[i]);
								sessionStorage.setItem(
									"question",
									JSON.stringify(questions[i])
								);
								break;
							}
						} else {
							if (
								user.hard === undefined &&
								partner.hard === undefined
							) {
								setQuestion(questions[i]);
								sessionStorage.setItem(
									"question",
									JSON.stringify(questions[i])
								);
								break;
							} else if (
								!user.hard.includes(questions[i].id) &&
								!partner.hard.includes(questions[i].id)
							) {
								setQuestion(questions[i]);
								sessionStorage.setItem(
									"question",
									JSON.stringify(questions[i])
								);
								break;
							}
						}
					}
				}
			}
			console.log("Got the question");
		}
	};

	const findRoom = async () => {
		if (username !== "") {
			const endpoint = URL_MATCHING_SERVICE + "/" + username;
			const res = await axios.get(endpoint, { username }).catch((err) => {
				if (err.status === STATUS_CODE_CONFLICT) {
					setRoom(null);
					setPartner(null);
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

	const updateHistory = async () => {
		console.log(sessionStorage.getItem("user"));
		console.log(sessionStorage.getItem("question"));
		const user = JSON.parse(sessionStorage.getItem("user"));
		const username = sessionStorage.getItem("username");
		const question = JSON.parse(sessionStorage.getItem("question"));
		const difficulty = sessionStorage.getItem("difficulty");
		console.log(user);
		console.log(username);
		console.log(question);
		console.log(difficulty);
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
				console.log(
					"You successfully updated the user's question history"
				);
			}
		}
	};

	const handleSolo = (difficulty) => {
		sessionStorage.setItem("difficulty", difficulty);
		console.log("Selected Solo with Difficulty: " + difficulty);
		alert("You have clicked solo!");
	};

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
		root.render(
			<TimerDialog data-param={[true, timerID, socket, username]} />
		);

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

	useEffect(() => {
		setUsername(sessionStorage.getItem("username"));
		verifyCookie();
		if (!(username === "undefined")) {
			console.log("Fetched user", username);
		}
	}, [username]);

	useEffect(() => {
		async function init() {
			console.log("No question");
			try {
				if (sessionStorage.getItem("difficulty") !== "null") {
					setDifficulty(sessionStorage.getItem("difficulty"));
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
				}
			} catch (err) {
				console.log(err);
			}
		}
		if (question === "") {
			if (sessionStorage.getItem("question") === null) {
				init();
			} else {
				console.log(
					"QUESTION:",
					JSON.parse(sessionStorage.getItem("question"))
				);
				setQuestion(JSON.parse(sessionStorage.getItem("question")));
				console.log("Question:", question);
			}
		}
	});

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
		root.render("");
		alert("Match not found, please try again!");
	};

	useEffect(() => {
		socket.emit("HELLO_THERE");
		socket.on("connect", () => {
			console.log(
				"Front-end connection to localhost:8001 socket successful."
			);
			console.log(" connected on socket id: " + socket.id);
			handleSocketID(socket.id);
		});
		console.log("HERE");
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

	const closeDialog = () => {
		setIsDeleteSuccess(false);
		setIsChangePasswordSuccess(false);
		setIsChangingPassword(false);
	};

	const setSuccessDialog = (msg) => {
		setDialogTitle("Success");
		setDialogMsg(msg);
	};

	const setErrorDialog = (msg) => {
		setDialogTitle("Error");
		setDialogMsg(msg);
	};

	const theme = createTheme();

	const handleRedditLink = () => {
		window.open("https://www.reddit.com/r/peerprep/");
	};

	if (isCookieVerified) {
		return (
			<ThemeProvider theme={theme}>
				<Box sx={{ display: "flex" }}>
					<CssBaseline />

					{/* Header */}
					<MuiAppBar
						position="absolute"
						sx={{
							zIndex: theme.zIndex.drawer + 1,
						}}
					>
						<Toolbar
							sx={{
								pr: "24px",
							}}
						>
							<Typography
								component="h1"
								variant="h6"
								color="inherit"
								noWrap
								sx={{ flexGrow: 1 }}
								align="left"
							>
								Welcome to your dashboard{" "}
								<code>{username}</code>
							</Typography>
						</Toolbar>
					</MuiAppBar>

					{/* Dashboard Drawer */}
					<MuiDrawer variant="permanent">
						<Toolbar
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "flex-end",
								px: [15],
							}}
						></Toolbar>
						<Divider />
						{/* Dashboard Drawer List */}
						<List component="nav">
							<React.Fragment>
								<ListItemButton
									component={Link}
									to="/dashboard"
								>
									<ListItemIcon>
										<HomeIcon />
									</ListItemIcon>
									<ListItemText primary="Home" />
								</ListItemButton>
								<ListItemButton onClick={handleRedditLink}>
									<ListItemIcon>
										<RedditIcon />
									</ListItemIcon>
									<ListItemText primary="Reddit" />
								</ListItemButton>
								<ListItemButton onClick={changingPassword}>
									<ListItemIcon>
										<PasswordIcon />
									</ListItemIcon>
									<ListItemText primary="Change Password" />
								</ListItemButton>
								<ListItemButton
									onClick={handleLogout}
									component={Link}
									to="/login"
								>
									<ListItemIcon>
										<LogoutIcon />
									</ListItemIcon>
									<ListItemText primary="Logout" />
								</ListItemButton>
								<ListItemButton onClick={handleDelete}>
									<ListItemIcon>
										<PersonRemoveIcon />
									</ListItemIcon>
									<ListItemText primary="Delete Account" />
								</ListItemButton>
							</React.Fragment>
						</List>
					</MuiDrawer>

					{/* Logic for button handlers */}
					<Dialog open={isChangingPassword} onClose={closeDialog}>
						<DialogTitle>{dialogTitle}</DialogTitle>
						<DialogContent>
							<DialogContentText>
								{isChangePasswordFail ? (
									dialogMsg
								) : (
									<TextField
										label="New Password"
										variant="standard"
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										sx={{ marginBottom: "1rem" }}
										style={{ width: 250 }}
										autoFocus
									/>
								)}
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button
								onClick={() => {
									if (isChangePasswordFail) {
										closeDialog();
									} else {
										closeDialog();
										handleChangePassword();
									}
								}}
							>
								Done
							</Button>
						</DialogActions>
					</Dialog>
					<Dialog
						open={isChangePasswordSuccess}
						onClose={closeDialog}
					>
						<DialogTitle>{dialogTitle}</DialogTitle>
						<DialogContent>
							<DialogContentText>{dialogMsg}</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={closeDialog}>Done</Button>
						</DialogActions>
					</Dialog>
					<Dialog open={isDeleteSuccess} onClose={closeDialog}>
						<DialogTitle>{dialogTitle}</DialogTitle>
						<DialogContent>
							<DialogContentText>{dialogMsg}</DialogContentText>
						</DialogContent>
						<DialogActions>
							{isDeleteSuccess ? (
								<Button component={Link} to="/signup">
									Done
								</Button>
							) : (
								<Button onClick={closeDialog}>Done</Button>
							)}
						</DialogActions>
					</Dialog>

					{/* Main Dashboard */}
					<Box
						component="main"
						sx={{
							backgroundColor: (theme) =>
								theme.palette.mode === "light"
									? theme.palette.grey[100]
									: theme.palette.grey[900],
							flexGrow: 1,
							height: "93vh",
							overflow: "auto",
							width: "100vw",
							mb: -10,
							mr: -8,
						}}
					>
						<Toolbar />
						<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
							<Grid container spacing={3}>
								{/* Difficulty Selection */}
								<Grid item xs={12} md={8} lg={9}>
									<Box
										display={"flex"}
										flexDirection={"column"}
										width={"100%"}
									>
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
														window.location.replace(
															`/dashboard`
														)
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
													PeerPrep Selection Page{" "}
													<code>{username}</code>
												</Typography>
											</Toolbar>
										</MuiAppBar>
										<Grid
											container
											justifyContent="center"
											flexDirection="row"
											spacing={12}
											sx={{
												pt: 12,
												display: "flex",
												flexDirection: "row",
											}}
										>
											<Grid item md={4} lg={2}>
												<Card>
													<CardActionArea
														onClick={() =>
															setDifficulty(
																"easy"
															)
														}
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
																variant={
																	"body2"
																}
																gutterBottom
																component="div"
															>
																Select this
																difficulty if
																you are new to
																programming!
															</Typography>
														</CardContent>
													</CardActionArea>
												</Card>
											</Grid>
											<Grid item md={4} lg={2} xs>
												<Card>
													<CardActionArea
														onClick={() =>
															setDifficulty(
																"medium"
															)
														}
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
																variant={
																	"body2"
																}
																gutterBottom
																component="div"
															>
																Select this
																difficulty if
																you are pro in
																programming!
															</Typography>
														</CardContent>
													</CardActionArea>
												</Card>
											</Grid>
											<Grid item md={4} lg={2} xs>
												<Card>
													<CardActionArea
														onClick={() =>
															setDifficulty(
																"hard"
															)
														}
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
																variant={
																	"body2"
																}
																gutterBottom
																component="div"
															>
																Select this
																difficulty if
																you are god in
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
											sx={{ pt: 12 }}
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
													onClick={() =>
														handleSolo(
															socket,
															difficulty
														)
													}
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
														":hover": {
															bgcolor: "white",
															color: "black",
															boxShadow: 20,
														},
													}}
													onClick={() =>
														handleMatching(
															socket,
															difficulty
														)
													}
												>
													Collab
												</Button>
											</Grid>
										</Grid>
										<div id="timer"></div>
									</Box>
									{/* <Paper
										onClick={(event) =>
											window.location.replace(
												`/selection`
											)
										}
										sx={{
											p: 2,
											display: "flex",
											flexDirection: "column",
											height: 240,
											":hover": {
												boxShadow: 20,
											},
										}}
									>
										Start PeerPrep now !
									</Paper> */}
								</Grid>

								{/* Points & Questions Completed*/}
								<Grid item xs={12} md={4} lg={3}>
									<Paper
										sx={{
											p: 2,
											display: "flex",
											flexDirection: "columnn",
											height: 240,
										}}
									>
										Points and Questions Completed
									</Paper>
								</Grid>

								{/* History */}
								<Grid item xs={12}>
									<Paper
										xs={{
											p: 2,
											display: "flex",
											flexDirection: "column ",
										}}
									>
										History
									</Paper>
								</Grid>
							</Grid>
						</Container>
					</Box>
				</Box>
			</ThemeProvider>
		);
	} else {
		return (
			<Box display={"flex"} flexDirection={"column"} width={"100%"}>
				<Typography variant={"h3"} marginBottom={"2rem"}>
					You are not logged in :( Please Log in
				</Typography>
				<Button component={Link} to="/login">
					Go to Log in Page
				</Button>
			</Box>
		);
	}
}

export default Dashboard;
