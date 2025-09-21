import { Router } from "express";
import { insertMessage } from "../db/queries.js";

const formRouter = Router();

// Validation middleware
function validateMessageInput(req, res, next) {
    const { author, message } = req.body;
    const errors = [];

    // Validate author
    if (!author || typeof author !== "string") {
        errors.push("Author is required");
    } else if (author.trim().length === 0) {
        errors.push("Author cannot be empty");
    } else if (author.length > 255) {
        errors.push("Author name is too long (max 255 characters)");
    } else if (!/^[a-zA-Z0-9\s\-_]+$/.test(author.trim())) {
        errors.push("Author name contains invalid characters");
    }

    // Validate message
    if (!message || typeof message !== "string") {
        errors.push("Message is required");
    } else if (message.trim().length === 0) {
        errors.push("Message cannot be empty");
    } else if (message.length > 1000) {
        errors.push("Message is too long (max 1000 characters)");
    }

    if (errors.length > 0) {
        return res.status(400).render("form", {
            errors,
            author: author || "",
            message: message || "",
        });
    }

    // Sanitize input
    req.body.author = author.trim();
    req.body.message = message.trim();

    next();
}

formRouter.get("/", (req, res) => {
    res.render("form", { errors: [], author: "", message: "" });
});

formRouter.post("/", validateMessageInput, async (req, res, next) => {
    try {
        const { author, message } = req.body;

        await insertMessage(message, author);
        res.redirect("/");
    } catch (error) {
        next(error);
    }
});

export { formRouter };
