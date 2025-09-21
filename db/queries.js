import { pool } from "./pool.js";

// Username functions
async function getAllUsernames() {
    const { rows } = await pool.query("SELECT * FROM usernames");
    return rows;
}

async function insertUsername(username) {
    await pool.query("INSERT INTO usernames (username) VALUES ($1)", [
        username,
    ]);
}

async function searchUsernames(searchTerm) {
    const { rows } = await pool.query(
        "SELECT * FROM usernames WHERE username LIKE $1",
        [`%${searchTerm}%`]
    );
    return rows;
}

async function deleteAllUsernames() {
    const result = await pool.query("DELETE FROM usernames");
    return result.rowCount;
}

// Message functions
async function getAllMessages() {
    const { rows } = await pool.query(`
        SELECT m.id, m.message_text as text, u.username as user, m.created_at as added
        FROM messages m
        JOIN usernames u ON m.user_id = u.id
        ORDER BY m.created_at DESC
    `);
    return rows;
}

async function getMessageById(messageId) {
    const { rows } = await pool.query(
        `
        SELECT m.id, m.message_text as text, u.username as user, m.created_at as added
        FROM messages m
        JOIN usernames u ON m.user_id = u.id
        WHERE m.id = $1
    `,
        [messageId]
    );
    return rows[0];
}

async function insertMessage(messageText, username) {
    // First, get or create the user
    let userResult = await pool.query(
        "SELECT id FROM usernames WHERE username = $1",
        [username]
    );

    if (userResult.rows.length === 0) {
        // User doesn't exist, create them
        const insertUserResult = await pool.query(
            "INSERT INTO usernames (username) VALUES ($1) RETURNING id",
            [username]
        );
        userResult = insertUserResult;
    }

    const userId = userResult.rows[0].id;

    // Insert the message
    const { rows } = await pool.query(
        "INSERT INTO messages (message_text, user_id) VALUES ($1, $2) RETURNING id, message_text as text, created_at as added",
        [messageText, userId]
    );

    // Get the username for the response
    const usernameResult = await pool.query(
        "SELECT username FROM usernames WHERE id = $1",
        [userId]
    );

    return {
        id: rows[0].id,
        text: rows[0].text,
        user: usernameResult.rows[0].username,
        added: rows[0].added,
    };
}

async function deleteAllMessages() {
    const result = await pool.query("DELETE FROM messages");
    return result.rowCount;
}

async function searchMessages(searchTerm) {
    const { rows } = await pool.query(
        `
        SELECT m.id, m.message_text as text, u.username as user, m.created_at as added
        FROM messages m
        JOIN usernames u ON m.user_id = u.id
        WHERE m.message_text LIKE $1 OR u.username LIKE $1
        ORDER BY m.created_at DESC
    `,
        [`%${searchTerm}%`]
    );
    return rows;
}

export {
    getAllUsernames,
    insertUsername,
    searchUsernames,
    deleteAllUsernames,
    getAllMessages,
    getMessageById,
    insertMessage,
    deleteAllMessages,
    searchMessages,
};
