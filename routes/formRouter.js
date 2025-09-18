import { Router } from "express";
import { messages } from "./indexRouter.js";

const formRouter = Router();

formRouter.get("/", (req, res) => {
    res.render("form", {});
});

formRouter.post("/", (req, res) => {
    const { author, message } = req.body;

    messages.push({
        text: message,
        user: author,
        added: new Date(),
    });

    res.redirect("/");
});

export { formRouter };
