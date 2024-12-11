import sqlite3 from "sqlite3";

const DBSOURCE = "./db/db.sqlite"

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw new Error(`An error occured while connecting to db, line 8 on database.ts: ${err.message}`);
  } else {
    console.log(`Connected to sqlite!`);
    db.run(`CREATE TABLE posts (
        id integer primary key autoincrement,
        title text,
        author text,
        body text
      )`, (err) => {
        if (err) {
          console.log("Table posts id already created:", err.message);
        } else {
          console.log("Table posts is created");
        }
      })
      db.run(`CREATE TABLE comments (
        id integer primary key autoincrement,
        author text,
        comment text,
        post_id integer unsigned
      )`, (err) => {
        if (err) {
          console.log("Table comments id already created:", err.message);
        } else {
          console.log("Table comments is created");
        }
      })
  }
})

export default db;