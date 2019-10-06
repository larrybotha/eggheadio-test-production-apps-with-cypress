const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const getDbInstance = () => {
  const adapter = new FileSync('db.test.json');

  return low(adapter);
};

module.exports = {
  seed: data => {
    const db = getDbInstance();

    db.setState(data).write();
  },

  snapshot: tableName => {
    const db = getDbInstance();

    return db.get(tableName);
  },
};
