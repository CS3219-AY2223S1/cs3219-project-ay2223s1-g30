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
	Avatar,
	CssBaseline,
	Paper,
	Grid,
	createTheme,
	ThemeProvider,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { URL_USER_SVC_LOGIN } from "../configs";
import {
	STATUS_CODE_OKAY,
	STATUS_CODE_CONFLICT,
	STATUS_CODE_UNAUTHORIZED,
} from "../constants";
import { Link } from "react-router-dom";
import PeerPrepLogo from "../resources/PeerPrepLogo.png"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"

function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState("");
	const [dialogMsg, setDialogMsg] = useState("");
	const [isLoginSuccess, setIsLoginSuccess] = useState(false);

	const theme = createTheme();

	const handleLogin = async () => {
		setIsLoginSuccess(false);
		sessionStorage.setItem("username", username);
		const res = await axios
			.post(URL_USER_SVC_LOGIN, { username, password })
			.catch((err) => {
				if (err.response.status === STATUS_CODE_CONFLICT) {
					setErrorDialog("No such username found!");
				} else if (err.response.status === STATUS_CODE_UNAUTHORIZED) {
					setErrorDialog("Wrong Password!");
				} else {
					setErrorDialog("Please try again later");
				}
			});
		if (res && res.status === STATUS_CODE_OKAY) {
			setSuccessDialog("You successfully logged in");
			setIsLoginSuccess(true);
		}
	};

	const closeDialog = () => setIsDialogOpen(false);

	const setSuccessDialog = (msg) => {
		setIsDialogOpen(true);
		setDialogTitle("Success");
		setDialogMsg(msg);
	};

	const setErrorDialog = (msg) => {
		setIsDialogOpen(true);
		setDialogTitle("Error");
		setDialogMsg(msg);
	};

	return (
		<ThemeProvider theme={theme}>
			<Grid container rowSpacing={8} columnSpacing={8} component="main" sx = {{mb: -10, minWidth: "100%", height: "100vh", width: "100vw"}}>
				<CssBaseline />
				<Grid
					item
					xs={false}
					sm={6}
					md={7}
					sx={{
						backgroundImage: `url(${PeerPrepLogo})`,
						backgroundRepeat: 'no-repeat',
						backgroundColor: (t) =>
							t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}}
				/>
				<Grid item xs={20} sm={15} md={5} component={Paper} elevation={6} square>
					<Box
						sx={{
							my: 8,
							mx: 4,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<Avatar sx={{ m: 1, bgcolour: 'secondary.main' }}>
							<LockOutlinedIcon/>
						</Avatar>
						<Typography variant={"h4"} component={"h1"}>
							Log In
						</Typography>
						<TextField
							label="Username"
							variant="standard"
							fullwidth
							margin="normal"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							sx={{ marginBottom: "1rem", width: '35vw'}}
							autoFocus
						/>
						<TextField
							label="Password"
							variant="standard"
							fullwidth
							margin="normal"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							sx={{ marginBottom: "2rem", width: '35vw'}}
						/>
						<Box
							display={"flex"}
							flexDirection={"row"}
							justifyContent={"flex-end"}
						>
							<Button variant={"contained"} sx={{width: '35vw', height: '5vh', marginBottom: "2rem"}} onClick={handleLogin}>
								Log In
							</Button>
						</Box>
						<Grid item>
							<Link href="#" variant = "body3" component={Link} to="/signup"> 
								{"Don't have an account? Sign Up"}
							</Link>
						</Grid>
						<Dialog open={isDialogOpen} onClose={closeDialog}>
							<DialogTitle>{dialogTitle}</DialogTitle>
							<DialogContent>
								<DialogContentText>{dialogMsg}</DialogContentText>
							</DialogContent>
							<DialogActions>
								{isLoginSuccess ? (
									<Button component={Link} to="/dashboard">
										Go to Dashboard
									</Button>
								) : (
									<Button onClick={closeDialog}>Done</Button>
								)}
							</DialogActions>
						</Dialog>
					</Box>
				</Grid>
			</Grid>
		</ThemeProvider>
	)

	// return (
	// 	<Box display={"flex"} flexDirection={"column"} width={"30%"}>
	// 		<Typography variant={"h3"} marginBottom={"2rem"}>
	// 			Log In
	// 		</Typography>
			// <TextField
			// 	label="Username"
			// 	variant="standard"
			// 	value={username}
			// 	onChange={(e) => setUsername(e.target.value)}
			// 	sx={{ marginBottom: "1rem" }}
			// 	autoFocus
			// />
			// <TextField
			// 	label="Password"
			// 	variant="standard"
			// 	type="password"
			// 	value={password}
			// 	onChange={(e) => setPassword(e.target.value)}
			// 	sx={{ marginBottom: "2rem" }}
			// />
			// <Box
			// 	display={"flex"}
			// 	flexDirection={"row"}
			// 	justifyContent={"flex-end"}
			// >
			// 	<Button variant={"outlined"} onClick={handleLogin}>
			// 		Log In
			// 	</Button>
			// </Box>

			// <Dialog open={isDialogOpen} onClose={closeDialog}>
			// 	<DialogTitle>{dialogTitle}</DialogTitle>
			// 	<DialogContent>
			// 		<DialogContentText>{dialogMsg}</DialogContentText>
			// 	</DialogContent>
			// 	<DialogActions>
			// 		{isLoginSuccess ? (
			// 			<Button component={Link} to="/dashboard">
			// 				Go to Dashboard
			// 			</Button>
			// 		) : (
			// 			<Button onClick={closeDialog}>Done</Button>
			// 		)}
			// 	</DialogActions>
			// </Dialog>
	// 	</Box>
	// );
}

export default LoginPage;
