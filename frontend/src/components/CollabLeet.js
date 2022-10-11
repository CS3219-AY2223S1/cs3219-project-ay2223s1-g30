import {
	Box,
	Button,
	Typography,
	ButtonGroup,
} from "@mui/material";
import { Link } from "react-router-dom";
import TextEditor from "./Collab/TextEditor.js"

function CollabLeet() {
    return (
        <Box>
			<Typography variant={"h3"} marginBottom={"10rem"}>
				Collaborative LeetCode
            </Typography>
            <div style={{ 'borderColor': 'red', 'borderStyle': 'solid' }}>Question goes here
            </div>

            <TextEditor />

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
