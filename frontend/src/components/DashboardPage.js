import {
	Box,
	Button,
	Typography,
} from "@mui/material";
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
			<Button component={Link} to="/Selection">
				Do Leetcode
            </Button>
		</Box>
    )
}

export default Dashboard
