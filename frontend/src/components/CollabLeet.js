import {
	Box,
	Typography,
	Toolbar,
	Card,
	Divider,
	Avatar,
	CardHeader,
	CardContent,
	Paper,
	IconButton,
	Grid,
	Button,
	TextField,
	Container
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import {
    URL_QUESTION_SVC,
    URL_MATCHING_SERVICE,
    URL_USER_SVC_DASHBOARD,
} from "../configs";
import { STATUS_CODE_OKAY, STATUS_CODE_CONFLICT } from "../constants";
import TextEditor from "./Collab/TextEditor.js";
import MuiAppBar from "@mui/material/AppBar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import { io } from "socket.io-client";

function CollabLeet() {
	const [difficulty, setDifficulty] = useState("");
	const [question, setQuestion] = useState("");
	const [questions, setQuestions] = useState("");
	const [username, setUsername] = useState("");
	const [user, setUser] = useState("");
	const [partner, setPartner] = useState("");
	const [room, setRoom] = useState("");
    console.log("diff: " + sessionStorage.getItem("difficulty"));
    const getUser = async () => {
        if (username !== "") {
            const endpoint = URL_USER_SVC_DASHBOARD;
            const res = await axios
                .post(endpoint, { username })
                .catch((err) => {
                    if (err.status === STATUS_CODE_CONFLICT) {
                        console.log("User not found");
                    } else {
                        console.log("Please try again later");
                    }
                });
            if (res && res.status === STATUS_CODE_OKAY) {
                setUser(res.data);
                console.log("You successfully retrieved user1");
            }
        }
    };

    const getPartner = async () => {
        if (room !== "") {
            const endpoint = URL_USER_SVC_DASHBOARD;
            const username1 = username === room.user1 ? room.user2 : room.user1;
            console.log("Got partner:", username1);
            const res = await axios
                .post(endpoint, { username: username1 })
                .catch((err) => {
                    console.log(err);
                    if (err.status === STATUS_CODE_CONFLICT) {
                        console.log("User not found");
                    } else {
                        console.log("Please try again later");
                    }
                });
            if (res && res.status === STATUS_CODE_OKAY) {
                setPartner(res.data);
                console.log("You successfully retrieved user2");
            }
        }
    };

    const getQuestions = async () => {
        const endpoint = URL_QUESTION_SVC;
        const res = await axios.get(endpoint).catch((err) => {
            console.log("Please try again later");
        });
        setQuestions(res.data);
        console.log("You successfully retrieved questions");
    };

    const findQuestion = async () => {
        if (user !== "" && partner !== "" && questions !== "") {
            console.log("Finding question");
            var found = false;
            for (let i = 0; i < questions.length; i++) {
                if (questions[i].difficulty === difficulty) {
                    if (room === null) {
                        if (difficulty === "easy") {
                            if (user.easy === undefined) {
                                found = true;
                                setQuestion(questions[i]);
                                sessionStorage.setItem(
                                    "question",
                                    JSON.stringify(questions[i])
                                );
                                break;
                            } else if (!user.easy.includes(questions[i].id)) {
                                found = true;
                                setQuestion(questions[i]);
                                sessionStorage.setItem(
                                    "question",
                                    JSON.stringify(questions[i])
                                );
                                break;
                            }
                        } else if (difficulty === "medium") {
                            if (user.medium === undefined) {
                                found = true;
                                setQuestion(questions[i]);
                                sessionStorage.setItem(
                                    "question",
                                    JSON.stringify(questions[i])
                                );
                                break;
                            } else if (!user.medium.includes(questions[i].id)) {
                                found = true;
                                setQuestion(questions[i]);
                                sessionStorage.setItem(
                                    "question",
                                    JSON.stringify(questions[i])
                                );
                                break;
                            }
                        } else {
                            if (user.hard === undefined) {
                                found = true;
                                setQuestion(questions[i]);
                                sessionStorage.setItem(
                                    "question",
                                    JSON.stringify(questions[i])
                                );
                                break;
                            } else if (!user.hard.includes(questions[i].id)) {
                                found = true;
                                setQuestion(questions[i]);
                                sessionStorage.setItem(
                                    "question",
                                    JSON.stringify(questions[i])
                                );
                                break;
                            }
                        }
                    } else {
                        if (difficulty === "easy") {
                            if (
                                user.easy === undefined &&
                                partner.easy === undefined
                            ) {
                                found = true;
                                setQuestion(questions[i]);
                                sessionStorage.setItem(
                                    "question",
                                    JSON.stringify(questions[i])
                                );
                                break;
                            } else if (
                                !user.easy.includes(questions[i].id) &&
                                !partner.easy.includes(questions[i].id)
                            ) {
                                found = true;
                                setQuestion(questions[i]);
                                sessionStorage.setItem(
                                    "question",
                                    JSON.stringify(questions[i])
                                );
                                break;
                            }
                        } else if (difficulty === "medium") {
                            if (
                                user.medium === undefined &&
                                partner.medium === undefined
                            ) {
                                found = true;
                                setQuestion(questions[i]);
                                sessionStorage.setItem(
                                    "question",
                                    JSON.stringify(questions[i])
                                );
                                break;
                            } else if (
                                !user.medium.includes(questions[i].id) &&
                                !partner.medium.includes(questions[i].id)
                            ) {
                                found = true;
                                setQuestion(questions[i]);
                                sessionStorage.setItem(
                                    "question",
                                    JSON.stringify(questions[i])
                                );
                                break;
                            }
                        } else {
                            if (
                                user.hard === undefined &&
                                partner.hard === undefined
                            ) {
                                found = true;
                                setQuestion(questions[i]);
                                sessionStorage.setItem(
                                    "question",
                                    JSON.stringify(questions[i])
                                );
                                break;
                            } else if (
                                !user.hard.includes(questions[i].id) &&
                                !partner.hard.includes(questions[i].id)
                            ) {
                                found = true;
                                setQuestion(questions[i]);
                                sessionStorage.setItem(
                                    "question",
                                    JSON.stringify(questions[i])
                                );
                                break;
                            }
                        }
                    }
                }
            }
            if (!found) {
                let randNum = Math.floor(Math.random() * questions.length);
                if (room === null) {
                    while (true) {
                        if (questions[randNum].difficulty === difficulty) {
                            break;
                        } else {
                            randNum = Math.floor(
                                Math.random() * questions.length
                            );
                        }
                    }
                    setQuestion(questions[randNum]);
                    sessionStorage.setItem(
                        "question",
                        JSON.stringify(questions[randNum])
                    );
                } else {
                    for (let i = 0; i < questions.length; i++) {
                        if (questions[i].difficulty === difficulty) {
                            setQuestion(questions[i]);
                            sessionStorage.setItem(
                                "question",
                                JSON.stringify(questions[i])
                            );
                        }
                    }
                }
            }
            console.log("Got the question");
        }
    };

    const findRoom = async () => {
        if (username !== "") {
            const endpoint = URL_MATCHING_SERVICE + "/" + username;
            const res = await axios.get(endpoint, { username }).catch((err) => {
                if (err.response.status === STATUS_CODE_CONFLICT) {
                    setRoom(null);
                    setPartner(null);
                } else {
                    console.log("Please try again later");
                }
            });
            if (res && res.status === STATUS_CODE_OKAY) {
                setRoom(res.data);
                console.log("You successfully found the user's room");
            }
        }
    };

    useEffect(() => {
        async function init() {
            console.log("No question");
            try {
                setUsername(sessionStorage.getItem("username"));
                setDifficulty(sessionStorage.getItem("difficulty"));
                if (user === "") {
                    await getUser();
                }
                if (room === "") {
                    await findRoom();
                }
                if (partner === "") {
                    await getPartner();
                }
                if (questions === "") {
                    await getQuestions();
                }
                if (question === "") {
                    findQuestion();
                }
            } catch (err) {
                console.log(err);
            }
        }
        if (question === "") {
            if (sessionStorage.getItem("question") === null) {
                init();
            } else {
                console.log(
                    "QUESTION:",
                    JSON.parse(sessionStorage.getItem("question"))
                );
                setQuestion(JSON.parse(sessionStorage.getItem("question")));
                console.log("Question:", question);
            }
        }
    });

    // Socket.io used for chat messaging
    const messageContainer = document.getElementById("message-container");
    const messageForm = document.getElementById("send-container");
    const messageInput = document.getElementById("message-input");
    const userName = sessionStorage.getItem("username");
    const collabRoomId = sessionStorage.getItem("collabRoomId");

    const [socket, setSocket] = useState();
    useEffect(() => {
        const s = io("http://localhost:8001");
        setSocket(s);
        s.emit("new-user", userName, collabRoomId);

        return () => {
            s.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket == null) return;
        socket.on("user-connected", (name) => {
            appendMessage(`${name} connected`);
        });
    }, [socket]);

    useEffect(() => {
        if (socket == null) return;
        socket.on("chat-message", (data) => {
            appendMessage(`${data.name}: ${data.message}`);
        });
    }, [socket]);

    useEffect(() => {
        if (socket == null) return;
        messageForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const message = messageInput.value;
            appendMessage(`You: ${message}`);
            socket.emit("send-chat-message", message, userName, collabRoomId);
            messageInput.value = "";
        });
    }, [socket]);

    function appendMessage(message) {
        const messageElement = document.createElement("div");
        messageElement.innerText = message;
        messageContainer.append(messageElement);
    }
    
    // Var used to hide messaging service in solo mode.
    var chatMessagingDisplay = "block";
    const isSoloMode = sessionStorage.getItem("isSoloMode");
    if ((isSoloMode != null) & (isSoloMode == "true")) {
        chatMessagingDisplay = "none";
    }
    
	function getShortDiff(difficulty) {
		if(difficulty == "easy") {
			return "E"
		} else if (difficulty == "medium") {
			return "M"
		} else if (difficulty == "hard"){
			return "H"
		}
	}
	return (
		<Box>
			<MuiAppBar position="absolute">
				<Toolbar
					sx={{
						pr: "24px",
					}}
				>
					<IconButton
						sx={{
							color: "white",
							":hover": {
								bgcolor: "white",
								color: "black",
								boxShadow: 20,
							},
						}}
						onClick={(event) =>
							window.location.replace(`/dashboard`)
						}
					>
						<ArrowBackIcon />
					</IconButton>
					<Typography
						component="h1"
						variant="h6"
						color="inherit"
						noWrap
						sx={{ flexGrow: 1 }}
						align="center"
					>
						PeerPrep Collaborative Page <code>{username}</code>
					</Typography>
				</Toolbar>
			</MuiAppBar>
			<Grid container direction="row" justifyContent="center" alignItems="stretch">
				<Grid item xs>
					<Box sx={{ pt: 2 }}>
						<Card
							variant="outlined"
							style={{
								height: "78vh",
								wordWrap: "break-word",
								overflow: "scroll",
								overflowX: "hidden",
							}}>
						<CardContent>
								<CardHeader
								avatar={
									<Avatar sx={{ 
										bgcolor:"white", 
										boxShadow: '0 0 1px 1px rgba(0, 0, 0, 1)',
										color:"black",}}>
										<Typography variant="subtitle1">
											{getShortDiff(sessionStorage.getItem("difficulty"))}
										</Typography>
									</Avatar>
								}
								title={							
								<Typography
									variant={"h6"}
									gutterBottom
									component="div"
									style={{
										wordWrap: 'break-word',
										maxWidth: "60%"
									}}>
									{question ? question.title + " " : null}
									
								</Typography>}>
							</CardHeader>
							
							<Divider/>
							<Divider/>

							<Typography
								variant={"body1"}
								sx={{ padding: "32px" }}
								gutterBottom
								component="div">
								{question ? question.question : null}
							</Typography>
							<Divider/>
							<Divider/>
							<Typography
								variant={"h5"}
								gutterBottom
								component="div"
								textAlign = "center"
								sx={{ pt: 2 }}
							>
								Examples
							</Typography>
							<Divider/>
							<Divider/>
								<Typography
									variant={"body1"}
									gutterBottom
									sx={{ padding: "32px" }}
									component="div">
									{question
										? question.examples
										.map((example, index) => {
											return (
												<div key={example}>
													{example}
												</div>
											);
										}): null}
								</Typography>
                                <Divider/>
							    <Divider/>
							<Typography
								variant={"h5"}
								gutterBottom
								component="div"
								textAlign = "center"
								sx={{ pt: 2 }}
							>
								Constraints
							</Typography>
                            <Divider/>
							<Divider/>
								<Typography
									variant={"body1"}
									gutterBottom
									sx={{ padding: "32px" }}
									component="div"
								>
									{question
										? question.constraints.map((constraint) => {
												return (
													<div key={constraint}>
														{constraint}
													</div>
												);
										})
										: null}
								</Typography>
								<Typography
									variant={"body1"}
									gutterBottom
									component="div"
								></Typography>
						</CardContent>
					</Card>
				</Box>
				</Grid>
				<Grid item xs>
					<Box sx={{ pt: 2 }}>
						<TextEditor />
					</Box>
				</Grid>
				<Grid item xs>
					{/*Chat Messaging*/}
					
					<Box sx={{ pt: 2 }}>
					<div style={{
						padding: "0",
						margin: "0",
						// display: "flex",
						// justifycontent:"center",
					}}>
					<Card
						variant="outlined"
						style={{
							wordWrap: "break-word",
							overflow: "scroll",
							overflowX: "hidden",
							minHeight: "70vh",
							maxHeight: "70vh",
						}}
					>
					<CardHeader title={
						<div style={{
							display: 'flex',
							alignItems: 'center',
							flexWrap: 'wrap',
							justifyContent: "center",
						}}>
							<Typography variant="h5">Chat</Typography>
							<ChatIcon style={{padding: "0 0 0 4px"}}/>
						</div>  

					}>
					</CardHeader>
					<Divider/>
					<div id="message-container"
						style={{
							width: "80%",
							maxWidth: "1200px",
						}}></div>
					</Card>
					<form id="send-container"
						style={{
							width: "100%",
							maxWidth: "90%",
							display:"inline",
							}}
					>
							<TextField 
							id="message-input"
							style={{
								width: "100%",
								padding: "3px 0 0 0"
								}}
								InputProps={{
									endAdornment: (
										<Button type="submit" variant="contained" color="primary" id="send-button">
											<SendIcon/>
										</Button>
									),
								   }}
							>
							</TextField>

					</form>
					</div>
				</Box>
				</Grid>
			</Grid>



			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			></div>
		</Box>
	);
}

export default CollabLeet;
