const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

module.exports = {
  seed: data => {
    const adapter = new FileSync('db.test.json');
    const db = low(adapter);

    db.setState(data).write();
  },
};
