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

  async todosPerPriority() {
    const result = await this.db.all(
      `

      `,
    );
    return result;
  }

  async emailOfMaxTodos() {
    const result = await this.db.get(
      `

        `,
    );
    return result;
  }

  async emailOfMinTodos() {
    const result = await this.db.get(
      `

      `,
    );
    return result;
  }

  async avgTodosPerUser() {
    const result = await this.db.get(
      `

      `,
    );
    return result;
  }
}

module.exports = Aggregates;
