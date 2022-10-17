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
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer"
import MuiAppBar from "@mui/material/AppBar"
import { useEffect, useState } from "react";
import axios from "axios";
import { 
	URL_USER_SVC, 
	URL_USER_SVC_DASHBOARD, 
	URL_USER_SVC_LOGOUT } from "../configs";
import {
	STATUS_CODE_OKAY,
	STATUS_CODE_CONFLICT,
	STATUS_CODE_FORBIDDEN,
	STATUS_CODE_UNAUTHORIZED,
} from "../constants";
import { Link } from "react-router-dom";
import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import RedditIcon from "@mui/icons-material/Reddit"
import HomeIcon from "@mui/icons-material/Home"
import PasswordIcon from "@mui/icons-material/Password"
import LogoutIcon from "@mui/icons-material/Logout"
import PersonRemoveIcon from "@mui/icons-material/PersonRemove"

function Dashboard() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [dialogTitle, setDialogTitle] = useState("");
	const [dialogMsg, setDialogMsg] = useState("");
	const [isChangePasswordSuccess, setIsChangePasswordSuccess] = useState(false);
	const [isChangePasswordFail, setIsChangePasswordFail] = useState(false);
	const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [isCookieVerified, setIsCookieVerified] = useState(false);

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
			console.log("Successfully Logged in")
			setIsCookieVerified(true);
		}
	}

	// Currently using name to see who to log out
	const handleLogout = async () => {
		const endpoint = URL_USER_SVC_LOGOUT;
		const res = await axios.post(endpoint, {username}).catch((err) => {
			if (err.response.status === STATUS_CODE_CONFLICT) {
				setErrorDialog("No such user found!");
			} else {
				setErrorDialog("Please try again later");
			}
		});
		if (res && res.status === STATUS_CODE_OKAY) {
			setUsername(undefined)
			console.log("Successfully Logged out")
		}
	}

	const changingPassword = () => {
		setIsChangingPassword(true);
		setIsChangePasswordFail(false);
		setDialogTitle("Change your password");
	};

	useEffect(() => {
		setUsername(sessionStorage.getItem("username"));
		verifyCookie()
		if (!(username === "undefined")) {
			console.log("Fetched user", username);
		}
	}, [username]);

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
	}

	if (isCookieVerified) {
		return (
			<ThemeProvider theme={theme}>
				<Box sx = {{ display: 'flex'}}>
					<CssBaseline />

					{/* Header */}
					<MuiAppBar 
						position = 'absolute' 
						sx = {{
							zIndex: theme.zIndex.drawer + 1,
						}}
					>
						<Toolbar
							sx = {{
								pr: '24px',
							}}
						>
							<Typography
								component = 'h1'
								variant = 'h6'
								color = 'inherit'
								noWrap
								sx = {{ flexGrow: 1 }}
								align="left"
							>
								Welcome to your dashboard <code>{username}</code>
							</Typography>
						</Toolbar>
					</MuiAppBar>

					{/* Dashboard Drawer */}
					<MuiDrawer variant = "permanent">
						<Toolbar
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'flex-end',
								px: [15],
							}}
						>
						</Toolbar>
						<Divider />
						{/* Dashboard Drawer List */}
						<List component = "nav">
							<React.Fragment>
								<ListItemButton component={Link} to="/dashboard">
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
								<ListItemButton onClick={handleLogout} component= {Link} to="/login">
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
										onChange={(e) => setPassword(e.target.value)}
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
					<Dialog open={isChangePasswordSuccess} onClose={closeDialog}>
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
						component = "main"
						sx = {{
							backgroundColor: (theme) =>
								theme.palette.mode === 'light'
									? theme.palette.grey[100]
									: theme.palette.grey[900],
							flexGrow: 1,
							height: '93vh',
							overflow: 'auto',
							width: '100vw',
							mb: -10,
							mr: -8
						}}
					>
						<Toolbar />
						<Container maxWidth="lg" sx = {{ mt:4, mb: 4}}>
							<Grid container spacing = {3}>

								{/* Difficulty Selection */}
								<Grid item xs = {12}  md = {8} lg = {9}>
									<Paper  onClick={event => window.location.replace(`/selection`)}
										sx = {{
											p:2,
											display: 'flex',
											flexDirection: 'column',
											height: 240,
											':hover': {
												boxShadow: 20,
											  },
										}}
									>
										Start PeerPrep now !
									</Paper>
								</Grid>

								{/* Points & Questions Completed*/}
								<Grid item xs = {12} md = {4} lg = {3}>
									<Paper
										sx = {{
											p: 2,
											display: 'flex',
											flexDirection: 'columnn',
											height: 240,
										}}
									>
										Points and Questions Completed
									</Paper>
								</Grid>
								
								{/* History */}
								<Grid item xs = {12}>
									<Paper xs = {{ p: 2, display: 'flex', flexDirection: 'column '}}>
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
			</Box>);
	}
}

export default Dashboard;
