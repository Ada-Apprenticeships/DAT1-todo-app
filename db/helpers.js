const sqlite3 = require("sqlite3").verbose();

class SQL {
  constructor(db) {
    if (!db) {
      this.db = new sqlite3.Database("todo.sqlite");
    } else {
      this.db = db;
    }
  }

  fetchUsers = async () => {
    const result = await this.db.all(
      `
      
      `,
    );
    return result;
  };

  fetchUsersAndTodos = async () => {
    const result = await this.db.all(
      `

      `,
    );
    return result;
  };

  fetchTodoById = async (todoId) => {
    const result = await this.db.get(
      `

      `,
    );
    return result;
  };


  insertUser = async ({ emailAddress, firstName, lastName, notificationInd }) => {
    await this.db.get(
      `

      `,
    );
  };

  insertTodo = async ({ emailAddress, title, content, priority }) => {
    await this.db.get(
      `

      `,
    );
  };

  updateTodo = async ({ title, content, priority, todoId, isComplete }) => {
    await this.db.get(
      `
      
      `,
    );
  };

  removeUser = async (emailAddress) => {
    await this.db.run(
      `
      
      `,
    );
  };
}

module.exports = SQL;
