import dotenv from "dotenv";
dotenv.config();

import fs from "node:fs/promises";
import express from "express";
import compression from "compression";
import path from "path";
import http from "http";
import cors from "cors";

const usernameAndPasswords = Object.entries(process.env).reduce(
  (prev, curr) => {
    const [key, value] = curr;
    if (key.match(/^USERNAME\d+$/)) {
      const n = key.replace("USERNAME", "");

      const username = value;
      const password = process.env[`PASSWORD${n}`];

      return {
        ...prev,
        [username]: password,
      };
    }
    return prev;
  },
  {}
);

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

app.use((req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Basic ")
  ) {
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

  if (
    !usernameAndPasswords[username] ||
    usernameAndPasswords[username] !== password
  ) {
    res.set("WWW-Authenticate", "Basic");
    res.sendStatus(401);
    return;
  }

  next();
});

app.get("/media", async (_req, res, next) => {
  const fileList = await fs.readdir(path.resolve(process.cwd(), "media"));

  res.json(fileList.filter((f) => !["README.md"].includes(f)));
});

// serve static files
app.use(express.static(path.resolve(process.cwd(), "dist")));
app.use("/media", express.static(path.resolve(process.cwd(), "media")));

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
