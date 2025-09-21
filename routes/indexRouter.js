import { Router } from "express";
import { getAllMessages, getMessageById } from "../db/queries.js";

const indexRouter = Router();

indexRouter.get("/messages/:id", async (req, res, next) => {
    try {
        const messageId = Number(req.params.id);
        if (isNaN(messageId)) {
            return res.status(400).send("Invalid message ID");
        }

        const message = await getMessageById(messageId);
        if (!message) {
            return res.status(404).send("Message not found");
        }

        res.render("viewMessage", { message });
    } catch (error) {
        next(error);
    }
});

indexRouter.get("/", async (req, res, next) => {
    try {
        const messages = await getAllMessages();
        res.render("index", {
            title: "Mini Message Board",
            messages: messages,
        });
    } catch (error) {
        next(error);
    }
});

export { indexRouter };
