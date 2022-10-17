import {Button, Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material'
import {useState} from 'react'
import CircularProgressWithLabel from "./CircularProgress";

export const TimerDialog = (data) => {

    // Need to access data properly
    const flag = Object.values(data)[0][0];
    const timerID = Object.values(data)[0][1];
    const socket = Object.values(data)[0][2];
    const userName = Object.values(data)[0][3];

    const [open, setOpen] = useState(flag);
    return (
        <Dialog 
        open={open}
        onClose={() => {setOpen(false); handleClose(timerID, socket, userName);}}
        aira-labelledby="dialog-title" 
        aria-describedby="dialog-description">
            <DialogTitle id="dialog-title">Matching In Progress</DialogTitle>
            <DialogContent>
                <CircularProgressWithLabel/>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={() => {setOpen(false); handleClose(timerID, socket, userName);}}>Cancel Timer</Button>
            </DialogActions>
        </Dialog>
    )
}

// On any closing, clearTimeout, emit socket leave-match
const handleClose = (timerID, socket, userName) => {
    clearTimeout(timerID);
    console.log("Timer closed by user");
    console.log("socket emit: leave-match for: " + userName + " cancel dialog.");
	socket.emit("leave-match", userName);
}
