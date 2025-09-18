import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { indexRouter } from "./routes/indexRouter.js";
import { newMessageRouter } from "./routes/newMessageRouter.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use("/new", newMessageRouter);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).send(err.message);
});

const PORT = 3000;
app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }

    console.log(`Mini message board app - listening on port ${PORT}!`);
});
