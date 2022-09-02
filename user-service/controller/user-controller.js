import { ormCreateUser as _createUser } from "../model/user-orm.js";
import { ormCheckUser as _checkUser } from "../model/user-orm.js";
import bcrypt from "bcryptjs";

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

			if (len < 8 || !regex.test(password)) {
				return res.status(403).json({
					message: `Password needs to:
						1. Be at least 8 characters,
						2. Contain at least 1 uppercase letter
						3. Contain at least 1 lowercase letter
						4. Contain at least 1 special character`,
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
