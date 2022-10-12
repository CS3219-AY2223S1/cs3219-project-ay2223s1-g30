import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import SelectionPage from "./components/SelectionPage";
import { Box } from "@mui/material";
import CollabLeet from "./components/CollabLeet";

function App() {
	return (
		<div className="App">
			<Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
				<Router>
					<Routes>
						<Route
							exact
							path="/"
							element={<Navigate replace to="/signup" />}
						></Route>
						<Route path="/signup" element={<SignupPage />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/dashboard" element={<DashboardPage />} />
						<Route path="/selection" element={<SelectionPage />} />
						<Route
							path="/collab"
							exact
							element={
								<Navigate
									replace
									to={`/collab/${sessionStorage.getItem(
										"collabRoomId"
									)}`}
								/>
							}
						></Route>
						<Route path="/collab/:id" element={<CollabLeet />} />
					</Routes>
				</Router>
			</Box>
		</div>
	);
}

export default App;
