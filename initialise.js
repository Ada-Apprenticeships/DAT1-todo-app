const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const { createTables, removeTables, insertData } = require("./db/setup.js");

(async () => {
  const db = await open({
    filename: "todo.sqlite",
    driver: sqlite3.Database,
  });
  const todos = [
    {
      email_address: "moussab@gmail.com",
      content: "Do homework",
      priority: "H",
      title: "Homework",
      is_complete: 0,
    },
    {
      email_address: "alice@gmail.com",
      content: "Organise meeting",
      priority: "H",
      title: "Meetings",
      is_complete: 0,
    },
    {
      email_address: "alice@gmail.com",
      content: "Plan staff training",
      priority: "L",
      title: "Planning",
      is_complete: 0,
    },
    {
      email_address: "alice@gmail.com",
      content: "Interview candidate lecturer",
      priority: "M",
      title: "Interviews",
      is_complete: 0,
    },
    {
      email_address: "alice@gmail.com",
      content: "Plan all staff day",
      priority: "M",
      title: "Interviews",
      is_complete: 0,
    },
    {
      email_address: "alice@gmail.com",
      content: "Walk the dog",
      priority: "L",
      title: "Interviews",
      is_complete: 0,
    },
  ];
  const users = [
    { email_address: "shannon@gmail.com", first_name: "Shannon" },
    { email_address: "moussab@gmail.com", first_name: "Moussab" },
    { email_address: "alice@gmail.com", first_name: "Alice" },
  ];
  try {
    await removeTables(db);
    await createTables(db, {
      todos,
      users,
    });
    await insertData(db);
  } catch (error) {
    console.log(`an error occurred whilst setting up the database...`);
    console.log(error.message);
  }
})();
