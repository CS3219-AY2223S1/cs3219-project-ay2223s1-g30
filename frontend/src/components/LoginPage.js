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
import { useState } from "react";
import axios from "axios";
import { URL_USER_SVC_LOGIN } from "../configs";
import {
    STATUS_CODE_OKAY,
	STATUS_CODE_CONFLICT,
    STATUS_CODE_UNAUTHORIZED
} from "../constants";
import { Link } from "react-router-dom";


function LoginPage() {
    const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState("");
	const [dialogMsg, setDialogMsg] = useState("");
	const [isLoginSuccess, setIsLoginSuccess] = useState(false);

    const handleLogin = async () => {
        setIsLoginSuccess(false);
        const res = await axios
            .post(URL_USER_SVC_LOGIN, {username, password})
            .catch((err) => {
                if (err.response.status === STATUS_CODE_CONFLICT) {
                    setErrorDialog("No such user name found!");
                } else if (err.response.status === STATUS_CODE_UNAUTHORIZED) {
                    setErrorDialog("Wrong Password!");
                } else {
                    setErrorDialog("Unknown Error, Try again later");
                }
            });
        if (res && res.status === STATUS_CODE_OKAY) {
            setSuccessDialog("Successfully logged in");
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
		<Box display={"flex"} flexDirection={"column"} width={"30%"}>
			<Typography variant={"h3"} marginBottom={"2rem"}>
				Log In
			</Typography>
			<TextField
				label="Username"
				variant="standard"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				sx={{ marginBottom: "1rem" }}
				autoFocus
			/>
			<TextField
				label="Password"
				variant="standard"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				sx={{ marginBottom: "2rem" }}
			/>
			<Box
				display={"flex"}
				flexDirection={"row"}
				justifyContent={"flex-end"}
			>
				<Button variant={"outlined"} onClick={handleLogin}>
					Log In
				</Button>
			</Box>

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
	);
}

export default LoginPage;
