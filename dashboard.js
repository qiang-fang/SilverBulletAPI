const { UserInputError } = require('apollo-server-express');
const { getDb, getNextSequence } = require('./db.js');
const { mustBeSignedIn } = require('./auth.js');

async function list() {
  // return dashboard;
  const db = getDb();
  const cursor = db.collection('dashboard').find({}).sort({ id: 1 });
  const dashboards = cursor.toArray();
  console.log('dashboard resolver: -----',dashboards);
  return { dashboards };
}

module.exports = {
  list,
};
