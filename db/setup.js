const { buildInsertString } = require("../lib/helpers.js");

async function insertData(db, { todos, users }) {
  const [userFields, userValues] = buildInsertString(users);
  const [todoFields, todoValues] = buildInsertString(todos);
  
  try {
    await db.exec(
      `
      INSERT INTO users ${userFields} VALUES ${userValues};
        `,
    );
  } catch (error) {
    throw new Error(`error inserting the users...${error.message}`)
   
  }

  try {
    await db.exec(
      `
      INSERT INTO todos ${todoFields} VALUES ${todoValues};
        `,
    );
  } catch (error) {
    throw new Error(`error inserting the users...${error.message}`)
   

  }
}

async function createTables(db, { todos, users }) {

  // define your tables in here...
  await db.exec(
    `
    
    `,
  );
 
}

async function removeTables(db) {
  const rawDb = db.getDatabaseInstance();
  await rawDb.serialize();
  const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
  await Promise.all(
    tables
      .filter(({ name }) => {
        return name !== "sqlite_sequence";
      })
      .map((table) => db.run(`DROP TABLE ${table.name}`)),
  );
}

module.exports = { createTables, removeTables,insertData };
