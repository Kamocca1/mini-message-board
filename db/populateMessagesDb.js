#! /usr/bin/env node
import "dotenv/config";
import { Client } from "pg";

const SQL = `
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  message_text TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES usernames(id) ON DELETE CASCADE
);

INSERT INTO messages (message_text, user_id) 
VALUES
  ('Hello everyone! This is my first message.', 1),
  ('Great to be here! Looking forward to chatting.', 1),
  ('Welcome to the message board!', 2),
  ('Thanks for the warm welcome!', 3),
  ('This is such a cool platform.', 2),
  ('I agree, really enjoying it so far.', 3),
  ('Anyone up for a discussion about coding?', 1),
  ('I love coding! What language are you working with?', 2),
  ('Currently learning JavaScript and Node.js', 3),
  ('That''s awesome! Node.js is great for backend development.', 1);
`;

async function main() {
    console.log("seeding messages...");
    const client = new Client({
        connectionString: process.env.DATABASE_PUBLIC_URL,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
}

main();
