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
	Table,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
	TableContainer,
	TableFooter,
	TablePagination,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import {
	Chart,
	PieSeries,
	Title,
	Legend,
} from "@devexpress/dx-react-chart-material-ui";
import { useEffect, useState } from "react";
import axios from "axios";
import {
	URL_USER_SVC,
	URL_USER_SVC_DASHBOARD,
	URL_USER_SVC_LOGOUT,
	URL_HISTORY_SVC,
	URL_QUESTION_SVC,
} from "../configs";
import {
	STATUS_CODE_OKAY,
	STATUS_CODE_CONFLICT,
	STATUS_CODE_FORBIDDEN,
	STATUS_CODE_UNAUTHORIZED,
} from "../constants";
import { Link } from "react-router-dom";
import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import RedditIcon from "@mui/icons-material/Reddit";
import HomeIcon from "@mui/icons-material/Home";
import PasswordIcon from "@mui/icons-material/Password";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import SelectInput from "@mui/material/Select/SelectInput";

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
	const [easyQuestions, setEasyQuestion] = useState([]);
	const [mediumQuestions, setMediumQuestion] = useState([]);
	const [hardQuestions, setHardQuestion] = useState([]);
	const [questionsDone, setQuestionsDone] = useState([]);
	const [history, setHistory] = useState([]);
	const [historyTableContent, setHistoryTableContent] = useState([]);
	const [isHistorySet, setHistorySet] = useState(false);

	const getHistory = async () => {
		const username = sessionStorage.getItem("username");
		const endpoint = URL_HISTORY_SVC + "/" + username;
		const res = await axios
			.get(endpoint)
			.catch((err) => {
				setErrorDialog("Please try again later");
			});

		const resEasyQuestions = res.data.easyQuestions;
		const resMediumQuestions = res.data.mediumQuestions;
		const resHardQuestions = res.data.hardQuestions;
		
		if (res && res.status === STATUS_CODE_OKAY) {
			setHistory(res.data);
			setHistorySet(true);
			setEasyQuestion(resEasyQuestions);
			setMediumQuestion(resMediumQuestions);
			setHardQuestion(resHardQuestions);
			setQuestionsDone([
				{ argument: 'Easy', value: resEasyQuestions.length },
				{ argument: 'Medium', value: resMediumQuestions.length },
				{ argument: 'Hard', value: resHardQuestions.length },
			])
		}
	}

	const updateDashboardHistory = async () => {
		const dashboardHistory = history;
		const endpoint = URL_QUESTION_SVC;
		const res = await axios
			.post(endpoint, {dashboardHistory})
			.catch((err) => {
				setErrorDialog("Please try again later");
			});
		
		if (res && res.status === STATUS_CODE_OKAY) {
			setHistoryTableContent(res.data);
		}
	}

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

	useEffect(() => {
		setUsername(sessionStorage.getItem("username"));
		verifyCookie();
		getHistory();
		updateDashboardHistory();
	
		if (!(username === "undefined")) {
			console.log("Fetched user", username);
		}
	}, [username, isHistorySet]);

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

	const warningText = {
		color: "red"
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
								px: [1],
							}}
						></Toolbar>
						<Divider />
						{/* Dashboard Drawer List */}
						<List component="nav" sx={{height: 1000}}>
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
								<Divider />
								<ListItemButton onClick={handleDelete}>
									<ListItemIcon>
										<PersonRemoveIcon />
									</ListItemIcon>
									<ListItemText 
										primary="Delete Account" 
										primaryTypographyProps={{ style: warningText}}
									/>
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
						component="permanent"
						sx={{
							backgroundColor: (theme) =>
								theme.palette.mode === "light"
									? theme.palette.grey[100]
									: theme.palette.grey[900],
							flexGrow: 1,
							height: "93vh",
							overflow: "auto",
							width: "100vw",
							marginLeft: "9.9rem",
							marginBottom: -10,
							mr: -8,
						}}
					>
						<Toolbar />
						<Container maxWidth="80vw" sx={{ mt: 2, mb: 2}}>
							<Grid container spacing={3}>
								{/* Difficulty Selection */}
								<Grid item xs={12} md={8} lg={9}>
									<TableContainer sx ={{height: 430}}>
										<Table aria-label = "History">
											<TableHead>
												<TableRow>
													<TableCell align="left">Problem ID</TableCell>
													<TableCell align="left">Problem Name</TableCell>
													<TableCell align="left">Difficulty</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{
													historyTableContent.map(row => (
														<TableRow
															key = {row.id}
														>
															<TableCell align="left">{row.ProblemID}</TableCell>
															<TableCell align="left">{row.ProblemName}</TableCell>
															<TableCell align="left">{row.Difficulty}</TableCell>
														</TableRow>
													))
												}
											</TableBody>
										</Table>
									</TableContainer>
								</Grid>


								{/*Questions Completed*/}
								<Grid item xs={12} md={4} lg={3}>
									<Paper
										sx={{
											p: 2,
											display: "flex",
											flexDirection: "columnn",
											height: 430,
										}}
									>
										<Chart data={questionsDone}>
											<Title text="Questions Completed"/>
											<Legend orientation="horizontal" position="left" margin={10}/>
											<PieSeries valueField="value" argumentField="argument" outerRadius={2}/>
										</Chart>
									</Paper>
								</Grid>

								{/* History */}
								<Grid item xs={12}>
									<Box
										display={"flex"}
										flexDirection={"column"}
										justifyContent={"flex-end"}
										sx={{
											alignItems: 'center',
										}}
									>
										<Button 
											variant={"contained"} 
											sx={{
												width: '35vw', 
												height: '5vh', 
												marginTop: "2rem",
											}} 
											onClick={(event) =>
												{
													const collabId = sessionStorage.getItem("collabRoomId");
													if (collabId === null) {
														window.location.replace(`/selection`);
													} else {
														window.location.replace(`/collab`);
													}
													
												}
											}>
											Start PeerPrep Now!
										</Button>
									</Box>
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
