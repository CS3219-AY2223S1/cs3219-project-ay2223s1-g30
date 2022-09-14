import {
	Box,
	Button,
	Typography,
	ButtonGroup,
} from "@mui/material";
import { Link } from "react-router-dom";

function CollabLeet() {
    return (
        <Box>
			<Typography variant={"h3"} marginBottom={"10rem"}>
				Collaborative LeetCode
			</Typography>
			<div
		style={{
		  display: 'flex',
		  justifyContent: 'center',
		  alignItems: 'center',
		}}>

		<ButtonGroup variant="contained" aria-label="outlined primary button group">
				<Button component={Link} to="/Selection">Go back to Selection Page</Button>
			</ButtonGroup>
			</div>
		</Box>
		
    )
}

export default CollabLeet
