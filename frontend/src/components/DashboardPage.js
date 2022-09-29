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
} from "@mui/material";
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

	if (isCookieVerified) {
		return (
			<Box display={"flex"} flexDirection={"column"} width={"100%"}>
				<Typography variant={"h3"} marginBottom={"2rem"}>
					Welcome to your dashboard <code>{username}</code>
				</Typography>
				<Button onClick={changingPassword}>Change password</Button>
				<Button component= {Link} to="/login" onClick={handleLogout}>
					Log out
				</Button>
				<Button component={Link} to="/Selection">
					Do Leetcode
				</Button>
				<Button onClick={handleDelete}>Delete account</Button>
				<Button onClick={verifyCookie}>Verify cookie</Button>
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
			</Box>
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
