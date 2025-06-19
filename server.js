import dotenv from "dotenv";
dotenv.config();

import fs from "node:fs/promises";
import express from "express";
import compression from "compression";
import path from "path";
import http from "http";
import cors from "cors";

import { walkDir } from "./utils.js";

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 8080;
app.set("port", port);

app.use(
	cors({
		origin: "*",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		preflightContinue: false,
		optionsSuccessStatus: 204,
	})
);
app.use(compression());
app.use(express.json());

app.use(async (req, res, next) => {
	let usernameAndPasswords = {};

	try {
		const tempBuf = await fs.readFile(
			path.resolve(process.cwd(), "users.json")
		);

		usernameAndPasswords = JSON.parse(tempBuf.toString());
	} catch (e) {
		res.status(500).send("Users not configured.");
		return;
	}

	if (
		!req.headers.authorization ||
		!req.headers.authorization.startsWith("Basic ")
	) {
		if (usernameAndPasswords?.anonymous === "yes") {
			res.locals.isAnonymous = true;
			next();
			return;
		}

		res.set("WWW-Authenticate", "Basic");
		res.sendStatus(401);
		return;
	}

	const usernamePasswordBase64 = req.headers.authorization.replace(
		"Basic ",
		""
	);
	const usernamePassword = Buffer.from(
		usernamePasswordBase64,
		"base64"
	).toString();

	const [username, password] = usernamePassword.split(":");

	res.locals.isAnonymous = false;
	if (
		usernameAndPasswords[username] &&
		usernameAndPasswords[username] === password
	) {
		res.locals.username = username;
		next();
		return;
	}

	res.set("WWW-Authenticate", "Basic");
	res.sendStatus(401);
	return;
});

app.get("/user-settings", async (_req, res) => {
	if (res.locals.isAnonymous) {
		res.json({});
		return;
	}

	try {
		const userSettingsBuf = await fs.readFile(
			path.resolve(process.cwd(), "user-settings.json")
		);

		const allUserSettings = JSON.parse(userSettingsBuf.toString());
		const currentUserSettings = allUserSettings[res.locals.username];
		if (!currentUserSettings) {
			res.json({});
			return;
		}

		res.json(currentUserSettings);
		return;
	} catch (e) {
		res.status(500).send("User settings not configured.");
		return;
	}
});

app.get("/media", async (req, res) => {
	switch (req.query.version) {
		case "3": {
			const result = await walkDir(path.resolve(process.cwd(), "media"), [
				".mp4",
			]);
			res.json(result);
			return;
		}
		case "2": {
			const result = await walkDir(path.resolve(process.cwd(), "media"));
			res.json(result);
			return;
		}
		default: {
			const fileList = await fs.readdir(path.resolve(process.cwd(), "media"));
			res.json(fileList.filter((f) => !["README.md"].includes(f)));
			return;
		}
	}
});

// serve static files
app.use(express.static(path.resolve(process.cwd(), "dist")));
app.use("/media", express.static(path.resolve(process.cwd(), "media")));
app.get("/old", (_req, res) => {
	res.sendFile(path.resolve(process.cwd(), "dist", "old.html"));
});

// redirect all other requests to index.html
app.use((_req, res) => {
	res.sendFile(path.resolve(process.cwd(), "dist", "index.html"));
});

// starting listening
server.listen(app.get("port"), () => {
	console.info(
		`${new Date().toLocaleTimeString()} Website server listening on ${app.get(
			"port"
		)}.`
	);
});
