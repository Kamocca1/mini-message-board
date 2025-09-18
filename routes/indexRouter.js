import { Router } from "express";

const indexRouter = Router();

const messages = [
    {
        text: "Hi there!",
        user: "Amando",
        added: new Date(),
    },
    {
        text: "Hello World!",
        user: "Charles",
        added: new Date(),
    },
];

indexRouter.get("/messages/:index", (req, res) => {
    const index = Number(req.params.index);
    const message = messages[index];
    if (!message) return res.status(404).send("Not found");
    res.render("viewMessage", { message });
});

indexRouter.get("/", (req, res) => {
    res.render("index", { title: "Mini Message Board", messages: messages });
});

export { indexRouter, messages };
