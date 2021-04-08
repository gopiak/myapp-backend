import config from "../config";
import { User } from "../resources/user/user.model";
import jwt from "jsonwebtoken";
import axios from "axios";

export const newToken = (user) => {
	return jwt.sign({ id: user.id }, config.secrets.jwt, {
		expiresIn: config.secrets.jwtExp,
	});
};

export const verifyToken = (token) =>
	new Promise((resolve, reject) => {
		jwt.verify(token, config.secrets.jwt, (err, payload) => {
			if (err) return reject(err);
			resolve(payload);
		});
	});

export const signup = async (req, res) => {
	console.log("signup Route");
	console.log({ ...req.body });
	if (!req.body.token) {
		return res.status(400).send({ message: "Token is required" });
	}
	try {
		console.log("Trying to fetch google user data");
		const profile = await axios.get(
			`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${req.body.token}`
		);
		// console.log({ ...profile });
		const data = {
			name: profile.data.name,
			email: profile.data.email,
			google_id: profile.data.id,
			img_url: profile.data.picture,
		};
		console.log(`Data: ${JSON.stringify(data)}`);
		console.log("Updating user doc if it exists");
		const userDoc = await User.findOneAndUpdate(
			{ ...data },
			{ loggedIn: true },
			{ new: true }
		)
			.lean()
			.exec();
		let token = null;
		if (!userDoc) {
			console.log(`Creating New User`);

			data.loggedIn = true;
			const newUser = await User.create({ ...data });
			console.log(`newUser: ${JSON.stringify(newUser)}`);
			token = newToken(newUser);
			console.log(`token: ${JSON.stringify(token)}`);
			return res.status(201).send({ token });
		} else {
			token = newToken(userDoc);
			console.log(`token: ${JSON.stringify(token)}`);
			return res.status(201).send({ token });
		}
	} catch (e) {
		console.error(e);
		return res.status(500).end();
	}
};

export const login = async (req, res) => {
	console.log("login Route");
	console.log({ ...req.body });
	if (!req.body.token) {
		return res.status(400).send({ message: "Token is required" });
	}
	try {
		console.log("Trying to fetch google user data");
		const profile = await axios.get(
			`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${req.body.token}`
		);
		// console.log({ ...profile });
		const data = {
			name: profile.data.name,
			email: profile.data.email,
			google_id: profile.data.id,
			img_url: profile.data.picture,
		};
		console.log(`Data: ${JSON.stringify(data)}`);
		console.log("Updating user doc if it exists");
		const userDoc = await User.findOneAndUpdate(
			{ ...data },
			{ loggedIn: true },
			{ new: true }
		)
			.lean()
			.exec();
		let token = null;
		if (!userDoc) {
			console.log(`Creating New User`);
			data.loggedIn = true;
			const newUser = await User.create({ ...data });
			console.log(`newUser: ${JSON.stringify(newUser)}`);
			token = newToken(newUser);
			console.log(`token: ${JSON.stringify(token)}`);
			return res.status(201).send({ token });
		} else {
			token = newToken(userDoc);
			console.log(`token: ${JSON.stringify(token)}`);
			return res.status(201).send({ token });
		}
	} catch (e) {
		console.error(e);
		return res.status(500).end();
	}
};

export const logout = async (req, res) => {
	try {
		const user = await User.findOneAndUpdate(
			{ ...req.user },
			{ loggedIn: false },
			{ new: true }
		)
			.lean()
			.exec();
		return res.status(200).send({ message: "Successfully logged out" });
	} catch (e) {
		console.error(e);
		return res.status(500).end();
	}
};

export const protect = async (req, res, next) => {
	const bearer = req.headers.authorization;

	if (!bearer || !bearer.startsWith("Bearer ")) {
		return res.status(401).end();
	}

	const token = bearer.split("Bearer ")[1].trim();
	let payload;
	try {
		payload = await verifyToken(token);
	} catch (e) {
		return res.status(401).end();
	}

	const user = await User.findById(payload.id).select("-img_url").lean().exec();

	if (!user) {
		return res.status(401).end();
	}

	req.user = user;
	next();
};
