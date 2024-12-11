import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import db from "./_database";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/bootstrap/",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/"))
);
app.use(
  "/jquery/",
  express.static(path.join(__dirname, "node_modules/jquery/dist"))
);

app.get("/", (req, res) => {
  res.render("index", { activePage: "home" });
});

app.get("/contact", function (req, res) {
  res.render("contact", { activePage: "contact" });
});

app.get("/new", function (req, res) {
  res.render("new", { activePage: "new" });
});

app.get("/posts", function (req, res) {
  const sql = "select * from posts";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400);
      res.send("database error:" + err.message);
      return;
    }
    res.render("posts", { activePage: "posts", posts: rows });
  });
});

app.get("/new_post", function (req, res) {
  res.render("new_post", { activePage: "new_post" });
});

app.get("/posts/:id/edit", function (req, res) {
  const sql = "select * from posts where id = ?";
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400);
      res.send("database error: " + err.message);
      return;
    }
    res.render("edit_post", { post: row, activePage: "posts" });
  });
});

app.post("/contact", function (req, res) {
  res.render("contact_answer", { activePage: "contact", formData: req.body });
});

app.post("/new", function (req, res) {
  res.render("new_answer", { activePage: "new", formData: req.body });
});

app.post("/new_post", function (req, res) {
  const data = [req.body.title, req.body.author, req.body.body];
  const sql = "INSERT INTO posts (title, author, body) VALUES (?,?,?)";
  db.run(sql, data, function (err: Error) {
    if (err) {
      res.status(400);
      res.send("database error:" + err.message);
      return;
    }
    res.render("new_post_answer", {
      activePage: "new_post",
      formData: req.body,
    });
  });
});

app.post("/posts/:id/edit", function (req, res) {
  const data = [req.body.title, req.body.author, req.body.body, req.params.id];
  db.run(
    `update posts set 
    title = COALESCE(?,title),
    author = COALESCE(?,author),
    body = COALESCE(?,body)
    where id = ?
    `,
    data,
    function (err: Error) {
      if (err) {
        res.status(400), res.send("database error: " + err.message);
        return;
      }
      res.redirect("/posts");
    }
  );
});

app.post("/posts/:id/comment", function (req, res) {
  const data = [req.body.author, req.body.comment, req.params.id];
  const sql = "INSERT INTO comments (author, comment, post_id) VALUES (?,?,?)";
  db.run(sql, data, function(err: Error) {
    if (err) {
      res.status(400);
      res.send("database error:" + err.message);
      return;
    }
    // console.log("comment successfully added to post_id:", req.params.id);
    res.redirect(`/posts/${req.params.id}`)
  })
});

app.get("/posts/:id/delete", function (req, res) {
  const sql = "DELETE FROM posts WHERE id = ?";
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400);
      res.send("database error:" + err.message);
      return;
    }
    res.redirect("/posts");
  });
});

app.get("/posts/:id", function (req, res) {
  const postSql = "select * from posts where id = ?";
  const commentsSql = "select * from comments where post_id = ?";
  const id = [req.params.id];
  db.get(postSql, id, (err, post) => {
    if (err) {
      res.status(400);
      res.send("database error: " + err.message);
      return;
    }
    db.all(commentsSql, id, (err, comments) => {
      if (err) {
        res.status(400);
        res.send("db error" + err.message);
        return;
      }
      res.render("show_post", { post: post, comments: comments, activePage: "posts" });
    });
  });
})

app.listen("3000", () => {
  console.log("Server is running on port 3000");
});
