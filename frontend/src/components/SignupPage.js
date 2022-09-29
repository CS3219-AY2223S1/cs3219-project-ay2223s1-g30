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
	FormControlLabel,
	Paper,
	Grid,
	createTheme,
	ThemeProvider,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { URL_USER_SVC } from "../configs";
import {
	STATUS_CODE_CONFLICT,
	STATUS_CODE_CREATED,
	STATUS_CODE_FORBIDDEN,
} from "../constants";
import { Link } from "react-router-dom";
import PeerPrepLogo from "../resources/PeerPrepLogo.png"

function SignupPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState("");
	const [dialogMsg, setDialogMsg] = useState("");
	const [isSignupSuccess, setIsSignupSuccess] = useState(false);

	const theme = createTheme();

	const handleSignup = async () => {
		setIsSignupSuccess(false);
		const res = await axios
			.post(URL_USER_SVC, { username, password })
			.catch((err) => {
				if (err.response.status === STATUS_CODE_CONFLICT) {
					setErrorDialog("This username already exists");
				} else if (err.response.status === STATUS_CODE_FORBIDDEN) {
					setErrorDialog(`Password needs to be at least 8 characters long
                    and contain at least 1 uppercase letter, 
                    1 lowercase letter, and 
                    1 special character`);
				} else {
					setErrorDialog("Please try again later");
				}
			});
		if (res && res.status === STATUS_CODE_CREATED) {
			setSuccessDialog("Account successfully created");
			setIsSignupSuccess(true);
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

						</Avatar>
						<Typography variant={"h4"} component={"h1"}>
							Sign Up
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
							<Button variant={"contained"} sx={{width: '35vw', height: '5vh'}} onClick={handleSignup}>
								Sign up
							</Button>
						</Box>
						<Dialog open={isDialogOpen} onClose={closeDialog}>
							<DialogTitle>{dialogTitle}</DialogTitle>
							<DialogContent>
								<DialogContentText>{dialogMsg}</DialogContentText>
							</DialogContent>
							<DialogActions>
								{isSignupSuccess ? (
									<Button component={Link} to="/login">
										Log in
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

}

export default SignupPage;
