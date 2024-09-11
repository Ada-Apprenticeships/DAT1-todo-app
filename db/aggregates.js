const sqlite3 = require("sqlite3").verbose();

class Aggregates {
  constructor(db) {
    if (!db) {
      this.db = new sqlite3.Database("todo.sqlite");
    } else {
      this.db = db;
    }
  }

  totalUsers = async () => {
    const result = await this.db.get(
      `
      
      `,
    );
    return result;
  };

  totalTodos = async () => {
    const result = await this.db.get(
      `
      
      `,
    );
    return result;
  };

  todosPerUser = async () => {
    const result = await this.db.all(
      `

      `,
    );
    return result;
  };

  todosPerPriority = async() => {
    const result = await this.db.all(
      `

      `,
    );
    return result;
  }

  emailOfMaxTodos = async() => {
    const result = await this.db.get(
      `

        `,
    );
    return result;
  }

  emailOfMinTodos = async()  => {
    const result = await this.db.get(
      `

      `,
    );
    return result;
  }

  avgTodosPerUser = async() => {
    const result = await this.db.get(
      `

      `,
    );
    return result;
  }
}

module.exports = Aggregates;
