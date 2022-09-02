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
import { URL_USER_SVC_DASHBOARD } from "../configs";
import { Link } from "react-router-dom";

function Dashboard() {
    return (
        <Box display={"flex"} flexDirection={"column"} width={"100%"}>
			<Typography variant={"h3"} marginBottom={"2rem"}>
				Welcome to your dashboard
			</Typography>
            <Button component={Link} to="/login">
                Log out
            </Button>
		</Box>
    )
}

export default Dashboard
