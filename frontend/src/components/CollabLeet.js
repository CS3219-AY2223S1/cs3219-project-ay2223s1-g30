import {
	Box,
	Typography,
	Toolbar,
	Card,
	CardContent,
	Paper,
	Tab,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Fab,
} from "@mui/material";
import { Link } from "react-router-dom";
import TextEditor from "./Collab/TextEditor.js"
import MuiAppBar from "@mui/material/AppBar"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function CollabLeet() {
	const username = sessionStorage.getItem("username");
	const floatingStyle = {
		margin: 0,
		top: 'auto',
		right: 20,
		bottom: 20,
		left: 'auto',
		position: 'fixed',
	};
    return (
        <Box>
			<MuiAppBar position = 'absolute'>
				<Toolbar
					sx = {{
						pr: '24px',
					}}>
						<IconButton sx={{ "&:hover": { color: "grey" } }} onClick={event => window.location.replace(`/selection`)}>
							<ArrowBackIcon/>
						</IconButton>
						<Typography
							component = 'h1'
							variant = 'h6'
							color = 'inherit'
							noWrap
							sx = {{ flexGrow: 1 }}
							align="center">
						PeerPrep Collaborative Page <code>{username}</code>
					</Typography>
				</Toolbar>
			</MuiAppBar>
			<Box sx={{pt:2}}>
				<Card 
				variant="outlined"
				style={{
					maxHeight: 200, 
					wordWrap: "break-word",
					maxWidth: '100%', 
					overflow: 'scroll',
					overflowX: "hidden"}}>
					<CardContent>
						<Typography variant={"h5"} gutterBottom component="div" sx={{pt: 2}}>
							Two Sum
						</Typography>
						<Paper variant="outlined" elevation={4} sx={{ padding: '32px'}}>
							<Typography variant={"body1"} gutterBottom component="div">
								Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
    							<br/>You may assume that each input would have exactly one solution, and you may not use the same element twice.
								<br/>You can return the answer in any order.<br/><br/>
								QuestionTextExampleQuestionTextExamplezQuestionTextExampleQuestionTextExampleQuestionTextExampleQuestionTextExampleQuestionTextExampleQuestionTextExample
								QuestionTextExampleQuestionTextExamplezQuestionTextExampleQuestionTextExampleQuestionTextExampleQuestionTextExampleQuestionTextExampleQuestionTextExample
								QuestionTextExampleQuestionTextExamplezQuestionTextExampleQuestionTextExampleQuestionTextExampleQuestionTextExampleQuestionTextExampleQuestionTextExample
								QuestionTextExampleQuestionTextExamplezQuestionTextExampleQuestionTextExampleQuestionTextExampleQuestionTextExampleQuestionTextExampleQuestionTextExample
								QuestionTextExampleQuestionTextExamplezQuestionTextExampleQuestionTextExampleQuestionTextExampleQuestionTextExampleQuestionTextExampleQuestionTextExample
								QuestionTextExampleQuestionTextExamplezQuestionTextExampleQuestionTextExampleQuestionTextExampleQuestionTextExampleQuestionTextExampleQuestionTextExample
							</Typography>
						</Paper>
						<Typography variant={"h5"} gutterBottom component="div" sx={{pt: 2}}>
							Examples
						</Typography>
						<Tab label = '1' value='1'></Tab>
						<Tab label = '2' value='2'></Tab>
						<Tab label = '3' value='3'></Tab>
						<Paper variant="outlined" elevation={4} sx={{ padding: '32px'}}>
							<Typography variant={"body1"} gutterBottom component="div">
								Input: nums = [2,7,11,15], target = 9
								Output: [0,1]
								Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
							</Typography>
							<Typography variant={"body1"} gutterBottom component="div">
								Input: nums = [3,2,4], target = 6
								Output: [1,2]
							</Typography>
							<Typography variant={"body1"} gutterBottom component="div">
								Input: nums = [3,3], target = 6
								Output: [0,1]
							</Typography>
						</Paper>
						<Typography variant={"h5"} gutterBottom component="div" sx={{pt: 2}}>
							Constraints
						</Typography>
						<Paper variant="outlined" elevation={4} sx={{ padding: '32px'}}>
							<List>
								<ListItem>
									<ListItemText primary="Example Constraint 1"></ListItemText>
									<ListItemText primary="Example Constraint 2"></ListItemText>
									<ListItemText primary="Example Constraint 3"></ListItemText>
								</ListItem>
							</List>
							<Typography variant={"body1"} gutterBottom component="div">

							</Typography>
						</Paper>
					</CardContent>
			</Card>
		</Box>
		<Box sx={{pt:2}}>
			<TextEditor />
		</Box>	
            <div
		style={{
		  display: 'flex',
		  justifyContent: 'center',
		  alignItems: 'center',
		}}>
			</div>
		</Box>
    )
}

export default CollabLeet
