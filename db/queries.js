import { pool } from "./pool.js";

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

export { getAllUsernames, insertUsername, searchUsernames, deleteAllUsernames };
