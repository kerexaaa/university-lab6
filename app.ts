import express from "express";
import path from "path";
import { fileURLToPath } from "url";

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

app.post("/contact", function (req, res) {
  res.render("contact_answer", { activePage: "contact", formData: req.body });
});

app.post("/new", function (req, res) {
  res.render("new_answer", { activePage: "new", formData: req.body });
});

app.listen("3000", () => {
  console.log("Server is running on port 3000");
});
