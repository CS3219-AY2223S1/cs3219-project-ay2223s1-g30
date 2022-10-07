import { ormCreateUser as _createUser } from "../model/user-orm.js";
import { ormCheckUser as _checkUser } from "../model/user-orm.js";
import { ormDeleteUser as _deleteUser } from "../model/user-orm.js";
import { ormUpdateUser as _updateUser } from "../model/user-orm.js";
import { ormCreateToken as _createToken } from "../model/token-orm.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../model/user-model.js";

export async function createUser(req, res) {
	try {
		const { username, password } = req.body;
		if (username && password) {
			const len = Object.keys(password).length;
			const regex =
				/^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/;
			const userExist = await _checkUser(username);

			if (userExist) {
				return res.status(409).json({
					message:
						"Username is already in use. Please choose another username!",
				});
			}

			// Check if password meets password requirements
			if (len < 8 || !regex.test(password)) {
				return res.status(403).json({
					message: `Password needs to:
						1. Be at least 8 characters,
						2. Contain at least 1 uppercase letter
						3. Contain at least 1 lowercase letter
						4. Contain at least 1 number
						5. Contain at least 1 special character`,
				});
			}

			// Hash password
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			const resp = await _createUser(username, hashedPassword);
			console.log(resp);
			if (resp.err) {
				return res
					.status(400)
					.json({ message: "Could not create a new user!" });
			} else {
				console.log(`Created new user ${username} successfully!`);
				return res.status(201).json({
					message: `Created new user ${username} successfully!`,
				});
			}
		} else {
			return res
				.status(400)
				.json({ message: "Username and/or Password are missing!" });
		}
	} catch (err) {
		console.log(err);
		return res
			.status(500)
			.json({ message: "Database failure when creating new user!" });
	}
}

export async function deleteUser(req, res) {
	try {
		const username = req.params.username;
		if (username) {
			const user = await _checkUser(username);

			if (!user) {
				return res.status(409).json({
					message: "User not found! Failed to delete user.",
				});
			} else {
				const token = req.cookies.token;
				const response = await _createToken(token);
				if (response.err) {
					return res
						.status(400)
						.json({ message: "Could not index a new token!" });
				} else {
					const resp = await _deleteUser(username);
					console.log(resp);
					if (resp.err) {
						return res
							.status(400)
							.json({ message: "Could not delete user!" });
					} else {
						res.clearCookie("token");
						console.log(`Deleted user ${username} successfully!`);
						return res.status(200).json({
							message: `Deleted user ${username} successfully!`,
						});
					}
				}
			}
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Unknown Error!",
		});
	}
}

export async function loginUser(req, res) {
	try {
		const { username, password } = req.body;
		if (username && password) {
			const user = await _checkUser(username);

			if (!user) {
				return res.status(409).json({
					message: "User not found! Try again.",
				});
			}

			if (user && (await bcrypt.compare(password, user.password))) {
				const token = generateToken(user._id);
				res.cookie("token", token, { httpOnly: true });
				res.status(200).json({
					_id: user.id,
					name: user.username,
					token: token,
				});
			} else {
				res.status(401).json({
					message: "Wrong Password!",
				});
			}
		} else {
			res.status(400).json({
				message: "Invalid Credentials!",
			});
		}
	} catch (err) {
		return res.status(500).json({
			message: "Unknown Error!",
		});
	}
}

export async function logoutUser(req, res) {
	try {
		const { username } = req.body;
		const user = await _checkUser(username);

		if (!user) {
			return res.status(409).json({
				message: "User not found! Try again.",
			});
		} else {
			const token = req.cookies.token;
			const resp = await _createToken(token);
			if (resp.err) {
				return res
					.status(400)
					.json({ message: "Could not index a new token!" });
			} else {
				res.clearCookie("token");
				res.status(200).json({
					message: "Successfully Logged out user",
				});
			}
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Unknown Error!",
		});
	}
}

export async function getMe(req, res) {
	try {
		const { username } = req.body;
		const user = await _checkUser(username);

		console.log("HERE");
		console.log(username);

		if (!user) {
			return res.status(409).json({
				message: "User not found! Try again.",
			});
		} else {
			const token = generateToken(user._id);
			res.cookie("token", token, { httpOnly: true });
			return res.status(200).json({
				_id: user.id,
				name: user.username,
				easy: user.easy,
				medium: user.medium,
				hard: user.hard,
				token: token,
			});
		}
	} catch (err) {
		return res.status(500).json({
			message: "Unknown Error!",
		});
	}
}

export async function getProtectedMe(req, res) {
	const { _id, name } = await userModel.findById(req.user.id);

	res.status(200).json({
		id: _id,
		name,
		message: "Successfully verified cookie",
	});
}

export async function updateUser(req, res) {
	try {
		const { username, password } = req.body;
		const user = await _checkUser(username);

		if (!user) {
			return res.status(409).json({
				message: "User not found! Failed to update user.",
			});
		} else {
			const regex =
				/^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/;
			const len = Object.keys(password).length;

			// Check if password meets password requirements
			if (len < 8 || !regex.test(password)) {
				return res.status(403).json({
					message: `Password needs to:
						1. Be at least 8 characters,
						2. Contain at least 1 uppercase letter
						3. Contain at least 1 lowercase letter
						4. Contain at least 1 number
						5. Contain at least 1 special character`,
				});
			}

			// Hash password
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			const resp = await _updateUser(user.id, hashedPassword);
			console.log(hashedPassword);
			console.log(resp);
			if (resp.err) {
				return res
					.status(400)
					.json({ message: "Could not update user!" });
			} else {
				console.log(`Updated user ${username} successfully!`);
				return res.status(200).json({
					message: `Updated user ${username} successfully!`,
				});
			}
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Unknown Error!",
		});
	}
}

// Generate JWT
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "1d",
	});
};
