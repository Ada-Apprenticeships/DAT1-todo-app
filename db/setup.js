

async function createTables(db) {

  // define your tables in here...
  await db.exec(
    `
    `,
  );
 
}

async function insertData(db) {

  // insert your data here...
  await db.exec(
    `
    `,
  );

}

// leave this function as it is...
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
