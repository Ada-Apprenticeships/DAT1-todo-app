const bodyParser = require("body-parser");
const express = require("express");
const exphbs = require("express-handlebars");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const path = require("path");
const SQL = require("./db/helpers");
const Aggregates = require("./db/aggregates");
const { groupUsers, groupUserByPriority, wrapTryCatch } = require("./lib/helpers");

// Boilerplate
const app = express();
(async () => {
  const db = await open({
    filename: "todo.sqlite",
    driver: sqlite3.Database,
  });
  const sql = new SQL(db);

  app.engine(
    ".hbs",
    exphbs.engine({
      defaultLayout: "layout",
      extname: ".hbs",
      helpers: {
        ternary: function (condition, yes, no) {
          return condition ? yes : no;
        },
        isChecked: function (condition) {
          return condition ? "checked" : "";
        },
      },
      partialsDir: path.join(__dirname, "/views/partials"),
    }),
  );
  app.set("view engine", ".hbs");

  app.use(express.static(__dirname + "/views"));
  app.use(
    bodyParser.urlencoded({
      extended: false,
    }),
  );

  // HOME PAGE

  app.get("/", async (req, res) => {
    let allUsers = await wrapTryCatch(sql.returnAllUsers, null, [])();
    let users = await wrapTryCatch(sql.returnUsersAndTodos, null, [])();

    res.render("index", { allUsers, users: groupUsers(users) });
  });

  // LIST TODOS

  app.get("/list_todos", (req, res) => {
    res.redirect("/");
  });

  app.post("/list_todos", async (req, res) => {
    let email = req.body.email;
    let todos = await sql.returnTodoByEmail(email);
    res.render("list_todos", { todos: todos });
  });

  // EDIT TODO

  app.get("/edit_todo", async (req, res) => {
    let todo = await wrapTryCatch(sql.returnTodoById, req.query.id);

    res.render("edit_todo", { todo });
  });

  app.post("/edit_todo", async (req, res) => {
    let todo_id = req.body.todo_id;
    let todo = await sql.returnTodoById(todo_id);
    res.render("edit_todo", { todo });
  });

  //Handle edit todo form

  app.post("/post_edit_todo", async (req, res) => {
    let todoId = req.body.todo_id;
    let title = req.body.title;
    let content = req.body.content;
    let priority = req.body.priority;
    let isComplete = req.body.is_complete;
    isComplete = isComplete === "on" ? "1" : "0";

    wrapTryCatch(sql.updateTodo, { title, content, priority, todoId, isComplete }).catch((errr) => {
      console.log(err);
    });

    res.redirect("/");
  });

  // USER SIGNUP

  app.get("/user_signup", (req, res) => {
    res.render("user_signup");
  });

  app.post("/user_signup", async (req, res) => {
    let emailAddress = req.body.email;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let notificationInd = req.body.notifSettings;

    wrapTryCatch(sql.insertUser, { emailAddress, firstName, lastName, notificationInd })().catch(
      (err) => {
        console.log(err);
      },
    );

    res.redirect("/");
  });

  // ADD TODO

  app.get("/add_todo", async (req, res) => {
    let users = await wrapTryCatch(sql.returnAllUsers, null, [])();

    res.render("add_todo", {
      users,
    });
  });

  app.post("/add_todo", async (req, res) => {
    let emailAddress = req.body.email;
    let title = req.body.title;
    let content = req.body.content;
    let priority = req.body.priority;

    wrapTryCatch(sql.insertTodo, { emailAddress, title, content, priority })();

    res.redirect("/");
  });

  // REMOVE USER

  app.get("/remove_user", async (req, res) => {
    let users = await wrapTryCatch(sql.returnAllUsers, null, [])();

    res.render("remove_user", { users });
  });

  app.post("/remove_user", async (req, res) => {
    let email = req.body.email;

    wrapTryCatch(async () => await removeUser(email));

    res.redirect("/");
  });

  // VIEW AGGREGATES

  app.get("/stats", async (req, res) => {
    let aggs = new Aggregates(db);

    let [
      totalUsers,
      totalTodos,
      todosPerUser,
      todosPerPriority,
      emailOfMaxTodos,
      emailOfMinTodos,
      avgTodosPerUser,
    ] = await Promise.all([
      wrapTryCatch(aggs.totalUsers, { total_users: "undefined" })(),
      wrapTryCatch(aggs.totalTodos, { total_todos: "undefined" })(),
      wrapTryCatch(aggs.todosPerUser(), [])(),
      wrapTryCatch(aggs.todosPerPriority, [])(),
      wrapTryCatch(aggs.emailOfMaxTodos, { email_address: "undefined" })(),
      wrapTryCatch(aggs.emailOfMinTodos, { email_address: "undefined" })(),
      wrapTryCatch(aggs.avgTodosPerUser, { avg_todos_per_user: "undefined" })(),
    ]);

    todosPerUser = todosPerUser.reduce((acc, { total_todos, email }) => {
      acc[email] = total_todos;
      return acc;
    }, {});

    res.render("stats", {
      todosPerUser: JSON.stringify({
        labels: Object.keys(todosPerUser),
        values: Object.values(todosPerUser),
      }),
      todosPerPriority: JSON.stringify(groupUserByPriority(todosPerPriority)),
      totalUsers: totalUsers?.total_users,
      totalTodos: totalTodos?.total_todos,
      todosPerUser: JSON.stringify(todosPerUser),
      emailOfMaxTodos: emailOfMaxTodos?.email_address,
      emailOfMinTodos: emailOfMinTodos?.email_address,
      avgTodosPerUser: avgTodosPerUser?.avg_todos_per_user,
    });
  });
})();

module.exports = app;
